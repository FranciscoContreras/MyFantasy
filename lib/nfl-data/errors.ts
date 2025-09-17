export type NFLDataErrorCode =
  | "MISSING_API_KEY"
  | "REQUEST_FAILED"
  | "PARSER_ERROR"
  | "NOT_IMPLEMENTED"
  | "UNKNOWN"

interface NFLDataErrorOptions {
  code?: NFLDataErrorCode
  cause?: unknown
  meta?: unknown
}

export class NFLDataError extends Error {
  public readonly code: NFLDataErrorCode
  public readonly cause?: unknown
  public readonly meta?: unknown

  constructor(message: string, options: NFLDataErrorOptions = {}) {
    super(message)
    this.name = "NFLDataError"
    this.code = options.code ?? "UNKNOWN"
    this.cause = options.cause
    this.meta = options.meta
  }
}

export function toNFLDataError(error: unknown, fallbackMessage: string): NFLDataError {
  if (error instanceof NFLDataError) {
    return error
  }

  if (error instanceof Error) {
    return new NFLDataError(error.message, {
      code: "REQUEST_FAILED",
      cause: error,
    })
  }

  return new NFLDataError(fallbackMessage, { code: "UNKNOWN", cause: error })
}
