// @vitest-environment node
import { describe, it, expect } from "vitest"
import {
  generateSlots,
  isBookableSlot,
  bookingSchema,
  formatSlotParis,
  BOOKING_CONFIG,
} from "@/lib/booking"

// Repères calendaires utilisés dans les tests :
// - 2026-07-06 est un lundi (été, Paris = UTC+2)
// - 2026-07-11 / 2026-07-12 : samedi / dimanche
// - 2026-01-05 est un lundi (hiver, Paris = UTC+1)

// Lundi 6 juillet 2026, 10h00 à Paris (08:00 UTC)
const NOW_SUMMER = new Date("2026-07-06T08:00:00Z")
// Lundi 5 janvier 2026, 10h00 à Paris (09:00 UTC)
const NOW_WINTER = new Date("2026-01-05T09:00:00Z")

function slotsOfDay(slots: { start: string }[], isoDay: string) {
  return slots.filter((s) =>
    new Intl.DateTimeFormat("fr-CA", {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(s.start)) === isoDay
  )
}

describe("generateSlots", () => {
  it("renvoie des créneaux de 30 minutes en ISO UTC", () => {
    const slots = generateSlots([], NOW_SUMMER)

    expect(slots.length).toBeGreaterThan(0)
    for (const slot of slots) {
      expect(new Date(slot.end).getTime() - new Date(slot.start).getTime()).toBe(
        BOOKING_CONFIG.slotMinutes * 60_000
      )
      expect(slot.start.endsWith("Z")).toBe(true)
    }
  })

  it("exclut les week-ends", () => {
    const slots = generateSlots([], NOW_SUMMER)

    expect(slotsOfDay(slots, "2026-07-11")).toHaveLength(0) // samedi
    expect(slotsOfDay(slots, "2026-07-12")).toHaveLength(0) // dimanche
  })

  it("propose 9h-12h et 14h-18h heure de Paris, pause déjeuner exclue (14 créneaux/jour)", () => {
    const slots = generateSlots([], NOW_SUMMER)
    const tuesday = slotsOfDay(slots, "2026-07-07")

    expect(tuesday).toHaveLength(14) // 6 le matin + 8 l'après-midi

    const parisHours = tuesday.map((s) =>
      new Intl.DateTimeFormat("fr-FR", {
        timeZone: "Europe/Paris",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
      }).format(new Date(s.start))
    )
    expect(parisHours[0]).toBe("09:00")
    expect(parisHours).not.toContain("12:00")
    expect(parisHours).not.toContain("13:30")
    expect(parisHours).toContain("14:00")
    expect(parisHours[parisHours.length - 1]).toBe("17:30")
  })

  it("convertit correctement Paris -> UTC en été (UTC+2)", () => {
    const slots = generateSlots([], NOW_SUMMER)
    const tuesday = slotsOfDay(slots, "2026-07-07")

    expect(tuesday[0].start).toBe("2026-07-07T07:00:00.000Z") // 9h Paris
  })

  it("convertit correctement Paris -> UTC en hiver (UTC+1)", () => {
    const slots = generateSlots([], NOW_WINTER)
    const tuesday = slotsOfDay(slots, "2026-01-06")

    expect(tuesday[0].start).toBe("2026-01-06T08:00:00.000Z") // 9h Paris
  })

  it("applique le préavis : aucun créneau avant now + noticeHours", () => {
    const slots = generateSlots([], NOW_SUMMER)
    const monday = slotsOfDay(slots, "2026-07-06")

    // Lundi 10h Paris + 12h de préavis -> tous les créneaux du lundi sont passés
    expect(monday).toHaveLength(0)

    const minStart = NOW_SUMMER.getTime() + BOOKING_CONFIG.noticeHours * 3_600_000
    for (const slot of slots) {
      expect(new Date(slot.start).getTime()).toBeGreaterThanOrEqual(minStart)
    }
  })

  it("respecte l'horizon de réservation", () => {
    const slots = generateSlots([], NOW_SUMMER)
    const maxStart = NOW_SUMMER.getTime() + BOOKING_CONFIG.horizonDays * 86_400_000

    for (const slot of slots) {
      expect(new Date(slot.start).getTime()).toBeLessThanOrEqual(maxStart)
    }
  })

  it("exclut les créneaux occupés (freebusy), y compris en chevauchement partiel", () => {
    const busy = [
      // couvre exactement 9h00-9h30 Paris le mardi
      { start: "2026-07-07T07:00:00Z", end: "2026-07-07T07:30:00Z" },
      // chevauche 10h00-10h30 ET 10h30-11h00 Paris
      { start: "2026-07-07T08:15:00Z", end: "2026-07-07T08:45:00Z" },
    ]
    const slots = generateSlots(busy, NOW_SUMMER)
    const starts = slotsOfDay(slots, "2026-07-07").map((s) => s.start)

    expect(starts).not.toContain("2026-07-07T07:00:00.000Z")
    expect(starts).toContain("2026-07-07T07:30:00.000Z")
    expect(starts).not.toContain("2026-07-07T08:00:00.000Z")
    expect(starts).not.toContain("2026-07-07T08:30:00.000Z")
    expect(starts).toContain("2026-07-07T09:00:00.000Z")
  })
})

describe("isBookableSlot", () => {
  it("accepte un créneau valide de la grille", () => {
    expect(isBookableSlot("2026-07-07T07:00:00.000Z", [], NOW_SUMMER)).toBe(true)
  })

  it("refuse un horaire hors grille (9h15)", () => {
    expect(isBookableSlot("2026-07-07T07:15:00.000Z", [], NOW_SUMMER)).toBe(false)
  })

  it("refuse un créneau occupé", () => {
    const busy = [{ start: "2026-07-07T07:00:00Z", end: "2026-07-07T07:30:00Z" }]
    expect(isBookableSlot("2026-07-07T07:00:00.000Z", busy, NOW_SUMMER)).toBe(false)
  })

  it("refuse un créneau le week-end", () => {
    // Samedi 11 juillet, 9h Paris
    expect(isBookableSlot("2026-07-11T07:00:00.000Z", [], NOW_SUMMER)).toBe(false)
  })

  it("refuse un créneau sous le préavis", () => {
    // Lundi 6 juillet 14h Paris : dans moins de 12h
    expect(isBookableSlot("2026-07-06T12:00:00.000Z", [], NOW_SUMMER)).toBe(false)
  })
})

describe("bookingSchema", () => {
  const valid = {
    name: "Jean Dupont",
    email: "jean@example.com",
    message: "Projet de site vitrine",
    slotStart: "2026-07-07T07:00:00.000Z",
    website: "",
  }

  it("accepte une réservation valide", () => {
    expect(bookingSchema.safeParse(valid).success).toBe(true)
  })

  it("accepte un message vide (optionnel)", () => {
    expect(bookingSchema.safeParse({ ...valid, message: "" }).success).toBe(true)
  })

  it("refuse un email invalide", () => {
    expect(bookingSchema.safeParse({ ...valid, email: "pas-un-email" }).success).toBe(false)
  })

  it("refuse un slotStart non ISO", () => {
    expect(bookingSchema.safeParse({ ...valid, slotStart: "demain 9h" }).success).toBe(false)
  })

  it("refuse un honeypot rempli", () => {
    expect(bookingSchema.safeParse({ ...valid, website: "spam" }).success).toBe(false)
  })

  it("refuse un nom trop court", () => {
    expect(bookingSchema.safeParse({ ...valid, name: "J" }).success).toBe(false)
  })
})

describe("formatSlotParis", () => {
  it("formate le créneau en français, heure de Paris", () => {
    // Comparer via le formateur (espaces insécables Intl), pas une chaîne écrite à la main
    const expected = new Intl.DateTimeFormat("fr-FR", {
      timeZone: "Europe/Paris",
      dateStyle: "full",
      timeStyle: "short",
    }).format(new Date("2026-07-07T07:00:00.000Z"))

    expect(formatSlotParis("2026-07-07T07:00:00.000Z")).toBe(expected)
    expect(formatSlotParis("2026-07-07T07:00:00.000Z")).toContain("mardi")
    expect(formatSlotParis("2026-07-07T07:00:00.000Z")).toContain("juillet")
  })
})
