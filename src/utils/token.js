const STORAGE_PREFIX = 'pp_'
const CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789'

export function generateToken() {
  return Array.from({ length: 8 }, () => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
}

export function saveSession(token, userData) {
  localStorage.setItem(STORAGE_PREFIX + token, JSON.stringify(userData))
}

export function loadSession(token) {
  const raw = localStorage.getItem(STORAGE_PREFIX + token)
  return raw ? JSON.parse(raw) : null
}

export function getMagicLink(token) {
  const base = `${window.location.origin}${import.meta.env.BASE_URL}`
  return `${base}?token=${token}`
}

export function getTokenFromUrl() {
  return new URLSearchParams(window.location.search).get('token')
}

export function setUrlToken(token) {
  const url = new URL(window.location.href)
  url.searchParams.set('token', token)
  window.history.replaceState({}, '', url.toString())
}
