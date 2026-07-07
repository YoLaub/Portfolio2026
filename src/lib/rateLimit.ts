const WINDOW_MS = 10 * 60 * 1000
const MAX_REQUESTS_PER_WINDOW = 5
const MAX_TRACKED_KEYS = 5000

// En mémoire : suffisant pour dissuader le spam sur un site à faible trafic.
// Se réinitialise à chaque cold start / redéploiement, et n'est pas partagé
// entre instances serverless — c'est un compromis assumé pour rester simple.
const hits = new Map<string, number[]>()

function prune(now: number) {
  for (const [key, timestamps] of hits) {
    const recent = timestamps.filter((t) => now - t < WINDOW_MS)
    if (recent.length === 0) {
      hits.delete(key)
    } else {
      hits.set(key, recent)
    }
  }
}

export function isRateLimited(key: string): boolean {
  const now = Date.now()

  if (hits.size > MAX_TRACKED_KEYS) {
    prune(now)
  }

  const timestamps = (hits.get(key) ?? []).filter((t) => now - t < WINDOW_MS)

  if (timestamps.length >= MAX_REQUESTS_PER_WINDOW) {
    hits.set(key, timestamps)
    return true
  }

  timestamps.push(now)
  hits.set(key, timestamps)
  return false
}

export function getClientIp(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for")
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim()
  }
  return request.headers.get("x-real-ip") ?? "unknown"
}
