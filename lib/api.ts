const defaultApiBaseUrl = "http://localhost:8000"

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_FASTAPI_BASE_URL?.replace(/\/$/, "") ?? defaultApiBaseUrl

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${apiBaseUrl}${normalizedPath}`
}

export async function extractFetchError(
  response: Response,
  fallbackMessage: string
): Promise<string> {
  try {
    const payload = (await response.json()) as { detail?: unknown; message?: unknown }
    if (typeof payload.detail === "string" && payload.detail.trim()) {
      return payload.detail
    }
    if (typeof payload.message === "string" && payload.message.trim()) {
      return payload.message
    }
  } catch {
    // Ignore JSON parsing errors and fall back to text/body status.
  }

  try {
    const text = await response.text()
    if (text.trim()) {
      return text
    }
  } catch {
    // Ignore body read errors and fall back to status code.
  }

  return `${fallbackMessage} (${response.status} ${response.statusText})`
}
