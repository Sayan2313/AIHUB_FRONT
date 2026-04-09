export function formatDurationMs(durationMs: number) {
  if (durationMs >= 1000) {
    return `${(durationMs / 1000).toFixed(durationMs >= 10000 ? 0 : 2)} s`
  }

  return `${Math.round(durationMs)} ms`
}
