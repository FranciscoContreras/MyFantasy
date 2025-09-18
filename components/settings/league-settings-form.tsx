"use client"

import * as React from "react"
import { useForm, useWatch } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { cn } from "@/lib/utils"
import { AnimatedButton } from "@/components/ui/animated-button"
import { Badge } from "@/components/ui/badge"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { GlassCard } from "@/components/ui/glass-card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import {
  alertChannels,
  defaultLeagueSettings,
  flexPositionOptions,
  leagueSettingsSchema,
  LeagueSettingsValues,
  platformOptions,
  scoringOptions,
  seasonModeOptions,
  syncFrequencies,
} from "./schema"

interface LeagueSettingsFormProps {
  defaultValues?: LeagueSettingsValues
  onSubmit?: (values: LeagueSettingsValues) => Promise<void> | void
  className?: string
}

type RosterKey = keyof LeagueSettingsValues["roster"]

const rosterConfig: Array<{ key: RosterKey; label: string; helper: string; min: number; max: number }> = [
  { key: "qb", label: "Quarterbacks", helper: "QB starters", min: 1, max: 3 },
  { key: "rb", label: "Running backs", helper: "RB starters", min: 1, max: 6 },
  { key: "wr", label: "Wide receivers", helper: "WR starters", min: 1, max: 6 },
  { key: "te", label: "Tight ends", helper: "TE starters", min: 1, max: 4 },
  { key: "flex", label: "Flex", helper: "RB/WR/TE spots", min: 0, max: 3 },
  { key: "superflex", label: "Superflex", helper: "QB eligible flex", min: 0, max: 2 },
  { key: "bench", label: "Bench", helper: "Bench depth", min: 0, max: 12 },
]

const SectionCard = ({
  title,
  description,
  children,
  tone = "default",
  footer,
}: {
  title: string
  description?: string
  children: React.ReactNode
  tone?: "default" | "muted" | "brand"
  footer?: React.ReactNode
}) => (
  <GlassCard tone={tone} className="relative space-y-6">
    <GlassCard.Header>
      <GlassCard.Title className="text-lg font-semibold text-slate-900">
        {title}
      </GlassCard.Title>
      {description ? <p className="text-sm text-slate-600">{description}</p> : null}
    </GlassCard.Header>
    <GlassCard.Content className="space-y-5">{children}</GlassCard.Content>
    {footer ? <GlassCard.Footer>{footer}</GlassCard.Footer> : null}
  </GlassCard>
)

export function LeagueSettingsForm({ defaultValues, onSubmit, className }: LeagueSettingsFormProps) {
  const form = useForm<LeagueSettingsValues>({
    mode: "onChange",
    resolver: zodResolver(leagueSettingsSchema),
    defaultValues: defaultValues ?? defaultLeagueSettings,
  })

  const platform = useWatch({ control: form.control, name: "platform" })
  const scoringType = useWatch({ control: form.control, name: "scoringType" })
  const roster = useWatch({ control: form.control, name: "roster" })
  const flexPositions = useWatch({ control: form.control, name: "flexPositions" })
  const autoSync = useWatch({ control: form.control, name: "autoSync" })
  const syncFrequency = useWatch({ control: form.control, name: "syncFrequency" })
  const alerts = useWatch({ control: form.control, name: "alerts" })

  const platformMeta = React.useMemo(() => platformOptions.find((item) => item.value === platform), [platform])

  const starters = React.useMemo(() => {
    return roster.qb + roster.rb + roster.wr + roster.te + roster.flex + roster.superflex
  }, [roster])

  const activeAlerts = React.useMemo(
    () => alertChannels.filter((channel) => alerts?.includes(channel.value)),
    [alerts],
  )

  const currentFlexLabels = React.useMemo(
    () => flexPositionOptions.filter((option) => flexPositions?.includes(option.value)).map((option) => option.label),
    [flexPositions],
  )

  const handleSubmit = async (values: LeagueSettingsValues) => {
    // Simulate a short async save so the loading state is noticeable.
    await new Promise((resolve) => setTimeout(resolve, 450))
    await onSubmit?.(values)
  }

  const disableSyncSelect = !autoSync

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={cn("space-y-10", className)}>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
          <SectionCard
            title="League identity"
            description="Tell the optimizer how to connect and what format you play."
          >
            <FormField
              control={form.control}
              name="leagueName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>League title</FormLabel>
                  <FormControl>
                    <Input placeholder="League name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="platform"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Platform</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select platform" />
                        </SelectTrigger>
                        <SelectContent>
                          {platformOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="text-xs text-slate-500">
                      {platformMeta?.helper ?? "Choose the source we sync from."}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="seasonMode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Season mode</FormLabel>
                    <FormControl>
                      <Select value={field.value} onValueChange={field.onChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select mode" />
                        </SelectTrigger>
                        <SelectContent>
                          {seasonModeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </SectionCard>

          <SectionCard
            tone="brand"
            title="Live summary"
            description="We track import status, scoring profile, and sync cadence."
            footer={
              <p className="text-xs text-slate-600">
                Settings sync immediately after you save. Switch to manual if you prefer one-off imports.
              </p>
            }
          >
            <dl className="space-y-4 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Platform</dt>
                <dd className="font-medium text-slate-900">{platformMeta?.label ?? "Unassigned"}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-slate-500">Format</dt>
                <dd className="font-medium text-slate-900 capitalize">{scoringType.replace("-", " ")}</dd>
              </div>
              <div>
                <dt className="text-slate-500">Flex pool</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {currentFlexLabels.length ? (
                    currentFlexLabels.map((label) => <Badge key={label}>{label}</Badge>)
                  ) : (
                    <span className="text-slate-400">None selected</span>
                  )}
                </dd>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/60 bg-white/80 p-3 text-center shadow-sm">
                  <p className="text-xs text-slate-500">Starters</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{starters}</p>
                </div>
                <div className="rounded-2xl border border-white/60 bg-white/80 p-3 text-center shadow-sm">
                  <p className="text-xs text-slate-500">Bench</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{roster.bench}</p>
                </div>
              </div>
              <div>
                <dt className="text-slate-500">Sync cadence</dt>
                <dd className="mt-2 flex items-center gap-2">
                  <Badge variant={autoSync ? "default" : "secondary"}>{autoSync ? "Auto" : "Manual"}</Badge>
                  <span className="text-slate-600">
                    {autoSync ? syncFrequency.replace("ly", "ly") : "Run imports on demand"}
                  </span>
                </dd>
              </div>
              <div>
                <dt className="text-slate-500">Alerts enabled</dt>
                <dd className="mt-2 flex flex-wrap gap-2">
                  {activeAlerts.length ? (
                    activeAlerts.map((alert) => <Badge key={alert.value}>{alert.label}</Badge>)
                  ) : (
                    <span className="text-slate-400">No notifications</span>
                  )}
                </dd>
              </div>
            </dl>
          </SectionCard>
        </div>

        <SectionCard
          title="Scoring profile"
          description="Control how we weight performance, matchups, and projections."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="scoringType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Scoring type</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select format" />
                      </SelectTrigger>
                      <SelectContent>
                        {scoringOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pprValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>PPR value</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={1}
                      step={0.25}
                      value={[field.value]}
                      onValueChange={(value) => field.onChange(value[0] ?? 0)}
                    />
                  </FormControl>
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>0</span>
                    <span>{field.value.toFixed(2)}</span>
                    <span>1.0</span>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="tePremium"
            render={({ field }) => (
              <FormItem>
                <FormLabel>TE premium bonus</FormLabel>
                <FormControl>
                  <Slider
                    min={0}
                    max={2}
                    step={0.25}
                    value={[field.value]}
                    onValueChange={(value) => field.onChange(value[0] ?? 0)}
                  />
                </FormControl>
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>0</span>
                  <span>{field.value.toFixed(2)} pts / rec</span>
                  <span>2.0</span>
                </div>
                <FormDescription className="text-xs text-slate-500">
                  Applies to tight end receptions when calculating projections.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </SectionCard>

        <SectionCard
          title="Roster configuration"
          description="Match your lineup slots so our optimizer respects roster rules."
        >
          <div className="grid gap-5 md:grid-cols-2">
            {rosterConfig.map(({ key, label, helper, min, max }) => (
              <FormField
                key={key}
                control={form.control}
                name={`roster.${key}` as const}
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <div>
                        <FormLabel>{label}</FormLabel>
                        <p className="text-xs text-slate-500">{helper}</p>
                      </div>
                      <span className="text-sm font-semibold text-slate-900">{field.value}</span>
                    </div>
                    <FormControl>
                      <Slider min={min} max={max} step={1} value={[field.value]} onValueChange={(value) => field.onChange(value[0] ?? min)} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
          <FormField
            control={form.control}
            name="flexPositions"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Eligible flex positions</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {flexPositionOptions.map((option) => {
                    const isActive = field.value?.includes(option.value)
                    return (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          const next = isActive
                            ? field.value.filter((value) => value !== option.value)
                            : [...(field.value ?? []), option.value]
                          field.onChange(next)
                        }}
                        className={cn(
                          "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                          isActive
                            ? "border-indigo-200 bg-indigo-50 text-indigo-600 shadow-sm"
                            : "border-white/60 bg-white/60 text-slate-600 hover:border-slate-200 hover:bg-white/80",
                        )}
                      >
                        {option.label}
                      </button>
                    )
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </SectionCard>

        <SectionCard
          title="Automation & alerts"
          description="Keep your league synced, updated, and notified automatically."
        >
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="autoSync"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm">
                  <div>
                    <FormLabel>Auto sync</FormLabel>
                    <p className="text-xs text-slate-500">Pull rosters, matchups, and scoring automatically.</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="syncFrequency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sync cadence</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange} disabled={disableSyncSelect}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select cadence" />
                      </SelectTrigger>
                      <SelectContent>
                        {syncFrequencies.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription className="text-xs text-slate-500">
                    {disableSyncSelect ? "Enable auto sync to choose a cadence." : "Pick how often Playwright runs imports."}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="allowWaivers"
            render={({ field }) => (
              <FormItem className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm">
                <div>
                  <FormLabel>Track waiver claims</FormLabel>
                  <p className="text-xs text-slate-500">Include waiver priority and bidding recommendations.</p>
                </div>
                <FormControl>
                  <Switch checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="alerts"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Notifications</FormLabel>
                <div className="space-y-3">
                  {alertChannels.map((channel) => {
                    const isEnabled = field.value?.includes(channel.value)
                    return (
                      <div
                        key={channel.value}
                        className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 p-3 shadow-sm"
                      >
                        <div>
                          <p className="text-sm font-medium text-slate-900">{channel.label}</p>
                          <p className="text-xs text-slate-500">
                            {channel.value === "injury" && "Instant injury designations and practice notes."}
                            {channel.value === "lineup" && "Lineup lock reminders with suggested swaps."}
                            {channel.value === "trade" && "Trade analyzer summaries each time an offer arrives."}
                            {channel.value === "news" && "Weather, depth chart, and beat reporter highlights."}
                          </p>
                        </div>
                        <Switch
                          checked={isEnabled}
                          onCheckedChange={(checked) => {
                            const next = checked
                              ? [...(field.value ?? []), channel.value]
                              : field.value.filter((value) => value !== channel.value)
                            field.onChange(next)
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid gap-4 md:grid-cols-2">
            <FormField
              control={form.control}
              name="emailReports"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm">
                  <div>
                    <FormLabel>Email summary</FormLabel>
                    <p className="text-xs text-slate-500">Send weekly matchup insights recap.</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="slackAlerts"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm">
                  <div>
                    <FormLabel>Slack alerts</FormLabel>
                    <p className="text-xs text-slate-500">Post breaking updates to your league channel.</p>
                  </div>
                  <FormControl>
                    <Switch checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </SectionCard>

        <div className="flex flex-col items-start justify-between gap-4 rounded-[20px] border border-indigo-200/60 bg-indigo-50/90 p-6 shadow-[0_20px_45px_rgba(79,70,229,0.18)] sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-indigo-700">Ready to lock in these league settings?</p>
            <p className="text-xs text-indigo-600/80">
              We&apos;ll validate your configuration, refresh imports, and update projections once you save.
            </p>
          </div>
          <AnimatedButton type="submit" loading={form.formState.isSubmitting}>
            Save league profile
          </AnimatedButton>
        </div>
      </form>
    </Form>
  )
}
