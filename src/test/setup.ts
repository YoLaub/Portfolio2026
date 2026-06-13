import "@testing-library/jest-dom/vitest"

// Polyfill IntersectionObserver for framer-motion
class IntersectionObserverMock {
  constructor(callback: IntersectionObserverCallback) {}
  observe() {}
  unobserve() {}
  disconnect() {}
}

Object.defineProperty(window, "IntersectionObserver", {
  writable: true,
  configurable: true,
  value: IntersectionObserverMock,
})
