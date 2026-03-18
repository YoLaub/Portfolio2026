"use client"

import { useState, useEffect } from "react"

export function useScrollSpy(sectionIds: string[]) {
  const [activeSection, setActiveSection] = useState<string>("")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const intersecting = entries.filter((e) => e.isIntersecting)
        if (intersecting.length === 0) return

        // Pick the topmost visible section
        const topmost = intersecting.reduce((closest, entry) =>
          entry.boundingClientRect.top < closest.boundingClientRect.top
            ? entry
            : closest
        )
        setActiveSection(topmost.target.id)
      },
      { threshold: 0.3, rootMargin: "-80px 0px 0px 0px" }
    )

    for (const id of sectionIds) {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [sectionIds])

  return activeSection
}
