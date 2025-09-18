import * as tf from "@tensorflow/tfjs"

import { AnalysisFactors, PlayerAnalysisResult } from "@/lib/analysis"
import type { MatchupAnalysisResult } from "@/lib/analysis/matchups"
import { clamp, roundTo, safeAverage } from "@/lib/analysis/utils"

const FEATURE_ORDER: Array<keyof AnalysisFactors> = [
  "historicalPerformance",
  "matchupDifficulty",
  "defensiveSchemeImpact",
  "coordinatorTendencies",
  "recentForm",
  "injuryImpact",
  "weatherImpact",
]

const DEFAULT_WEIGHTS = tf.tensor2d([
  [0.9],
  [1.1],
  [0.85],
  [0.7],
  [1.2],
  [0.6],
  [0.4],
])
const DEFAULT_BIAS = tf.scalar(1.5)

export interface PredictionInput {
  playerId: string
  season: number
  week: number
  baselineProjection: number
  factors: AnalysisFactors
  analysis?: PlayerAnalysisResult
  position?: string
  samples?: Array<{ points: number; week: number }>
  matchup?: MatchupAnalysisResult
}

export interface ProbabilityBucket {
  label: string
  probability: number
  floor: number
  ceiling: number
}

export interface PredictionOutput {
  playerId: string
  season: number
  week: number
  mean: number
  floor: number
  ceiling: number
  confidence: number
  distribution: ProbabilityBucket[]
  insights: string
  modelVersion: string
}

interface InsightPayload {
  playerId: string
  position?: string
  week: number
  season: number
  factors: AnalysisFactors
  baselineProjection: number
  compositeScore?: number
  confidence?: number
}

export class TensorflowPredictionModel {
  private weights = DEFAULT_WEIGHTS
  private bias = DEFAULT_BIAS

  predictPoints(features: AnalysisFactors, baseline: number) {
    return tf.tidy(() => {
      const featureVector = FEATURE_ORDER.map((metric) => features[metric] ?? 0)
      const input = tf.tensor2d(featureVector, [1, FEATURE_ORDER.length])
      const linear = input.matMul(this.weights).add(this.bias)
      const normalized = linear.relu()
      const scaledTensor = normalized.mul(tf.scalar(6))
      const scaled = scaledTensor.dataSync()[0]
      const projection = baseline * 0.55 + scaled
      return projection
    })
  }

  calibrateFromSamples(samples: Array<{ points: number; features: AnalysisFactors }>) {
    if (!samples.length) {
      return
    }

    const xs = tf.tensor2d(
      samples.map((sample) => FEATURE_ORDER.map((metric) => sample.features[metric] ?? 0)),
    )
    const ys = tf.tensor2d(samples.map((sample) => [sample.points]))

    const xt = xs.transpose()
    const xtx = xt.matMul(xs)
    const pinvFn = (tf.linalg as unknown as { pinv?: (tensor: tf.Tensor2D) => tf.Tensor2D }).pinv
    const xtxInv = pinvFn ? pinvFn(xtx as tf.Tensor2D) : tf.eye(xtx.shape[0])
    const xty = xt.matMul(ys)
    const solution = xtxInv.matMul(xty) as tf.Tensor2D

    this.weights.dispose()
    this.weights = solution
    this.bias.dispose()
    this.bias = tf.scalar(0)
  }
}

export class OpenAIInsightService {
  constructor(private readonly fetcher: typeof fetch = fetch) {}

  async generateInsights(payload: InsightPayload): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY
    if (!apiKey) {
      return this.generateLocalInsight(payload)
    }

    try {
      const response = await this.fetcher("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "You are a concise NFL fantasy analyst. Summarise in two sentences actionable start/sit guidance using provided metrics.",
            },
            {
              role: "user",
              content: JSON.stringify(payload),
            },
          ],
          temperature: 0.6,
          max_tokens: 160,
        }),
      })

      if (!response.ok) {
        throw new Error(`OpenAI request failed: ${response.status}`)
      }

      const json = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>
      }
      const message = json.choices?.[0]?.message?.content?.trim()
      return message || this.generateLocalInsight(payload)
    } catch (error) {
      console.warn("[OpenAIInsightService] falling back", error)
      return this.generateLocalInsight(payload)
    }
  }

  private generateLocalInsight(payload: InsightPayload) {
    const momentum = payload.factors.recentForm >= 0.55 ? "hot streak" : "neutral form"
    const matchup = payload.factors.matchupDifficulty >= 0.6 ? "favorable matchup" : "cautious matchup"
    return `${payload.playerId} projects near ${payload.baselineProjection.toFixed(
      1,
    )} pts with ${momentum}; expect a ${matchup} in week ${payload.week}.`
  }
}

export class PredictionEngine {
  private readonly model: TensorflowPredictionModel
  private readonly insights: OpenAIInsightService

  constructor({
    model,
    insights,
  }: {
    model?: TensorflowPredictionModel
    insights?: OpenAIInsightService
  } = {}) {
    this.model = model ?? new TensorflowPredictionModel()
    this.insights = insights ?? new OpenAIInsightService()
  }

  async predict(input: PredictionInput): Promise<PredictionOutput> {
    let mean = this.model.predictPoints(input.factors, input.baselineProjection)
    const matchupBoost = input.matchup ? clamp(input.matchup.overallScore - 0.5) : 0
    mean = mean * (1 + matchupBoost * 0.12)

    const historicalStd = this.estimateStdDev(input)
    const matchupStd = input.matchup ? clamp(input.matchup.volatility, 0, 1) * 3 : 0
    const adjustedStd = historicalStd * (0.85 + matchupStd)

    const floor = Math.max(0, mean - 1.5 * adjustedStd)
    const ceiling = mean + 1.8 * adjustedStd

    const factorReliability = input.analysis
      ? safeAverage(Object.values(input.analysis.factors).map((detail) => detail.reliability))
      : safeAverage(Object.values(input.factors))

    const matchupReliability = input.matchup ? clamp(1 - input.matchup.volatility) : factorReliability
    const blendedReliability = clamp((factorReliability + matchupReliability) / 2)
    const confidence = Math.round(blendedReliability * 100)

    const distribution = this.buildDistribution(mean, adjustedStd)

    const insights = await this.insights.generateInsights({
      playerId: input.playerId,
      position: input.position,
      week: input.week,
      season: input.season,
      factors: input.factors,
      baselineProjection: input.baselineProjection,
      compositeScore: input.analysis?.compositeScore,
      confidence: confidence / 100,
    })

    return {
      playerId: input.playerId,
      season: input.season,
      week: input.week,
      mean: roundTo(mean, 2),
      floor: roundTo(floor, 2),
      ceiling: roundTo(ceiling, 2),
      confidence,
      distribution,
      insights,
      modelVersion: "tfjs-linear-v1",
    }
  }

  private estimateStdDev(input: PredictionInput) {
    if (input.samples?.length) {
      const sampleMean = safeAverage(input.samples.map((sample) => sample.points))
      const variance = safeAverage(
        input.samples.map((sample) => (sample.points - sampleMean) ** 2),
      )
      return Math.sqrt(variance || 4)
    }

    const reliability = input.analysis
      ? safeAverage(Object.values(input.analysis.factors).map((factor) => factor.reliability))
      : 0.5

    const matchupModifier = input.matchup ? clamp(1 - input.matchup.overallScore) : 0.3

    const baseVolatility = 6 - reliability * 2 + matchupModifier
    return clamp(baseVolatility, 2, 8)
  }

  private buildDistribution(mean: number, std: number): ProbabilityBucket[] {
    const buckets: Array<[string, number]> = [
      ["bust", -1.5],
      ["solid", -0.25],
      ["boom", 0.75],
    ]

    return buckets.map(([label, multiplier]) => {
      const floor = Math.max(0, mean + multiplier * std)
      const ceiling = Math.max(floor, mean + (multiplier + 0.75) * std)
      const probability = clamp(multiplier >= 0 ? 0.3 + multiplier * 0.2 : 0.25)
      return {
        label,
        probability: roundTo(probability, 2),
        floor: roundTo(floor, 2),
        ceiling: roundTo(ceiling, 2),
      }
    })
  }
}

export const predictionEngine = new PredictionEngine()
