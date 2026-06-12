const SESSION_PREFIX = 'pp_session_'
const TOKEN_PARAM = 'token'

export function generateToken() {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 16)
}

export function saveSession(token, data) {
  try {
    localStorage.setItem(SESSION_PREFIX + token, JSON.stringify(data))
  } catch {}
}

export function loadSession(token) {
  try {
    const raw = localStorage.getItem(SESSION_PREFIX + token)
    return raw ? JSON.parse(raw) : null
  } catch { return null }
}

export function getTokenFromUrl() {
  const params = new URLSearchParams(window.location.search)
  return params.get(TOKEN_PARAM) || null
}

export function setUrlToken(token) {
  const url = new URL(window.location.href)
  url.searchParams.set(TOKEN_PARAM, token)
  window.history.replaceState({}, '', url.toString())
}

export function getMagicLink(token) {
  if (!token) return window.location.origin
  const url = new URL(window.location.origin + window.location.pathname)
  url.searchParams.set(TOKEN_PARAM, token)
  return url.toString()
}
