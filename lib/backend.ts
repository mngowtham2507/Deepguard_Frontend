const DEFAULT_BACKEND_BASE_URL = 'http://127.0.0.1:8000'

function normalizeBaseUrl(url: string) {
  return url.replace(/\/+$/, '')
}

export function getBackendBaseUrl() {
  return normalizeBaseUrl(
    process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      DEFAULT_BACKEND_BASE_URL
  )
}
