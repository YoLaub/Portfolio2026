import "@testing-library/jest-dom/vitest"

// Polyfill IntersectionObserver for framer-motion
class IntersectionObserverMock {
  observe() {}
  unobserve() {}
  disconnect() {}
}

// Les tests de services purs tournent en environnement node (// @vitest-environment node)
// où window n'existe pas : ne polyfiller qu'en jsdom.
if (typeof window !== "undefined") {
  Object.defineProperty(window, "IntersectionObserver", {
    writable: true,
    configurable: true,
    value: IntersectionObserverMock,
  })
}
