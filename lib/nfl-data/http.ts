type QueryValue = string | number | boolean | null | undefined

export interface HttpGetOptions {
  params?: Record<string, QueryValue>
  headers?: HeadersInit
  timeoutMs?: number
  baseUrl?: string
}

export async function fetchJson<T>(input: string | URL, options: HttpGetOptions = {}): Promise<T> {
  const { params, headers, timeoutMs = 10_000, baseUrl } = options
  const url = buildUrl(input, baseUrl)

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value === undefined || value === null) continue
      url.searchParams.set(key, String(value))
    }
  }

  const controller = new AbortController()
  const timeoutId = timeoutMs > 0 ? setTimeout(() => controller.abort(), timeoutMs) : undefined

  try {
    const response = await fetch(url, {
      headers,
      signal: controller.signal,
    })

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`)
    }

    return (await response.json()) as T
  } finally {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
  }
}

function buildUrl(input: string | URL, baseUrl?: string): URL {
  if (input instanceof URL) {
    return new URL(input.toString())
  }

  if (baseUrl) {
    return new URL(input, baseUrl)
  }

  return new URL(input)
}
