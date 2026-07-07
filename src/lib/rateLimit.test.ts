import { describe, it, expect } from "vitest"
import { isRateLimited, getClientIp } from "@/lib/rateLimit"

describe("isRateLimited", () => {
  it("allows requests under the limit", () => {
    const key = `test-key-${Math.random()}`
    for (let i = 0; i < 5; i++) {
      expect(isRateLimited(key)).toBe(false)
    }
  })

  it("blocks requests once the limit is exceeded", () => {
    const key = `test-key-${Math.random()}`
    for (let i = 0; i < 5; i++) {
      isRateLimited(key)
    }
    expect(isRateLimited(key)).toBe(true)
  })

  it("tracks distinct keys independently", () => {
    const keyA = `test-key-a-${Math.random()}`
    const keyB = `test-key-b-${Math.random()}`
    for (let i = 0; i < 5; i++) {
      isRateLimited(keyA)
    }
    expect(isRateLimited(keyA)).toBe(true)
    expect(isRateLimited(keyB)).toBe(false)
  })
})

describe("getClientIp", () => {
  it("reads the first IP from x-forwarded-for", () => {
    const request = new Request("http://localhost/api/contact", {
      headers: { "x-forwarded-for": "203.0.113.1, 10.0.0.1" },
    })
    expect(getClientIp(request)).toBe("203.0.113.1")
  })

  it("falls back to x-real-ip", () => {
    const request = new Request("http://localhost/api/contact", {
      headers: { "x-real-ip": "203.0.113.2" },
    })
    expect(getClientIp(request)).toBe("203.0.113.2")
  })

  it("falls back to 'unknown' when no IP header is present", () => {
    const request = new Request("http://localhost/api/contact")
    expect(getClientIp(request)).toBe("unknown")
  })
})
