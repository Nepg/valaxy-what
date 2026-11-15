import type { Post } from 'valaxy'

/** Stable UTC metadata avoids server/browser locale hydration differences. */
export function postDate(value: Post['date']): string {
  if (!value)
    return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10).replaceAll('-', '.')
}
