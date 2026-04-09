const defaultApiBaseUrl = "http://localhost:8000"

export const apiBaseUrl =
  process.env.NEXT_PUBLIC_FASTAPI_BASE_URL?.replace(/\/$/, "") ?? defaultApiBaseUrl

export function buildApiUrl(path: string) {
  const normalizedPath = path.startsWith("/") ? path : `/${path}`
  return `${apiBaseUrl}${normalizedPath}`
}
