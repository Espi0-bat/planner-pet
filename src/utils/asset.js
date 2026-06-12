export function asset(path) {
  return import.meta.env.BASE_URL.replace(/\/$/, '') + path
}
