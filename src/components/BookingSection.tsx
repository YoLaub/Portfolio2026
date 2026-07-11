"use client"

import { useCallback, useEffect, useState } from "react"
import { bookingSchema } from "@/lib/booking"

interface Slot {
  start: string
  end: string
}

type LoadState = "loading" | "ready" | "unavailable" | "error"

const dayKeyFormat = new Intl.DateTimeFormat("fr-CA", {
  timeZone: "Europe/Paris",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
})

const dayLabelFormat = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  weekday: "short",
  day: "numeric",
  month: "short",
})

const timeFormat = new Intl.DateTimeFormat("fr-FR", {
  timeZone: "Europe/Paris",
  hour: "2-digit",
  minute: "2-digit",
  hourCycle: "h23",
})

function groupByDay(slots: Slot[]): Map<string, Slot[]> {
  const days = new Map<string, Slot[]>()
  for (const slot of slots) {
    const key = dayKeyFormat.format(new Date(slot.start))
    const list = days.get(key) ?? []
    list.push(slot)
    days.set(key, list)
  }
  return days
}

const inputClass =
  "w-full px-4 py-3 rounded-lg bg-bg-primary text-text-primary transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary border border-border focus-visible:border-accent"

export function BookingSection() {
  const [loadState, setLoadState] = useState<LoadState>("loading")
  const [slots, setSlots] = useState<Slot[]>([])
  const [selectedDay, setSelectedDay] = useState<string | null>(null)
  const [selectedSlot, setSelectedSlot] = useState<Slot | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", message: "", website: "" })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitting, setSubmitting] = useState(false)
  const [conflictMessage, setConflictMessage] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<{
    meetLink: string | null
    slotLabel: string
  } | null>(null)

  const loadSlots = useCallback(async () => {
    setLoadState("loading")
    try {
      const response = await fetch("/api/booking/slots")
      if (response.status === 503) {
        setLoadState("unavailable")
        return
      }
      if (!response.ok) {
        setLoadState("error")
        return
      }
      const data = (await response.json()) as { slots: Slot[] }
      setSlots(data.slots)
      setSelectedDay((current) => {
        const days = groupByDay(data.slots)
        if (current && days.has(current)) return current
        const first = days.keys().next()
        return first.done ? null : first.value
      })
      setLoadState("ready")
    } catch {
      setLoadState("error")
    }
  }, [])

  useEffect(() => {
    loadSlots()
  }, [loadSlots])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev }
        delete next[name]
        return next
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting || !selectedSlot) return

    const payload = { ...formData, slotStart: selectedSlot.start }
    const result = bookingSchema.safeParse(payload)
    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as string
        if (!fieldErrors[field]) fieldErrors[field] = issue.message
      }
      setErrors(fieldErrors)
      return
    }

    setErrors({})
    setSubmitting(true)
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(result.data),
      })

      if (response.ok) {
        const data = (await response.json()) as {
          meetLink: string | null
          slotLabel: string
        }
        setConfirmation({ meetLink: data.meetLink, slotLabel: data.slotLabel })
      } else if (response.status === 409) {
        setConflictMessage(
          "Ce créneau vient d'être réservé par quelqu'un d'autre. Choisissez-en un autre."
        )
        setSelectedSlot(null)
        await loadSlots()
      } else {
        setErrors({ _global: "Une erreur est survenue. Veuillez réessayer." })
      }
    } catch {
      setErrors({ _global: "Impossible de contacter le serveur. Veuillez réessayer." })
    } finally {
      setSubmitting(false)
    }
  }

  // ----- Écran de confirmation -----
  if (confirmation) {
    return (
      <div
        role="status"
        className="rounded-xl border border-success/30 bg-success/10 p-8 text-center"
      >
        <h3 className="text-xl font-semibold text-text-primary mb-3">
          Rendez-vous confirmé !
        </h3>
        <p className="text-text-secondary mb-4">
          {confirmation.slotLabel} (heure de Paris), en visio.
        </p>
        {confirmation.meetLink && (
          <p className="mb-4">
            <a
              href={confirmation.meetLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent font-semibold hover:text-accent-hover break-all"
            >
              {confirmation.meetLink}
            </a>
          </p>
        )}
        <p className="text-text-secondary text-sm">
          Vous recevrez également une invitation Google Calendar et un email de confirmation.
        </p>
      </div>
    )
  }

  // ----- États de chargement / indisponibilité -----
  if (loadState === "loading") {
    return (
      <p className="text-text-secondary text-center py-8" role="status">
        Chargement des créneaux disponibles...
      </p>
    )
  }

  if (loadState === "unavailable") {
    return (
      <p className="text-text-secondary text-center py-8">
        La réservation en ligne est momentanément indisponible. Écrivez-moi via
        l&apos;assistant en bas à droite, je reviens vers vous rapidement.
      </p>
    )
  }

  if (loadState === "error") {
    return (
      <div className="text-center py-8">
        <p className="text-text-secondary mb-4">
          Impossible de charger les créneaux.
        </p>
        <button
          type="button"
          onClick={loadSlots}
          className="border border-accent text-accent font-semibold rounded-lg px-6 py-2 hover:bg-accent-soft transition-colors"
        >
          Réessayer
        </button>
      </div>
    )
  }

  const days = groupByDay(slots)

  if (days.size === 0) {
    return (
      <p className="text-text-secondary text-center py-8">
        Aucun créneau disponible pour le moment. Écrivez-moi via l&apos;assistant,
        nous trouverons un moment.
      </p>
    )
  }

  const daySlots = selectedDay ? days.get(selectedDay) ?? [] : []

  // ----- Mini-formulaire après choix du créneau -----
  if (selectedSlot) {
    return (
      <form onSubmit={handleSubmit} noValidate aria-label="Confirmer le rendez-vous" className="max-w-[500px] mx-auto space-y-4">
        <div className="flex items-center justify-between gap-4 rounded-lg border border-accent bg-accent-soft/40 px-4 py-3">
          <p className="text-text-primary text-sm font-medium">
            {dayLabelFormat.format(new Date(selectedSlot.start))} ·{" "}
            {timeFormat.format(new Date(selectedSlot.start))} (30 min, visio)
          </p>
          <button
            type="button"
            onClick={() => setSelectedSlot(null)}
            className="text-accent text-sm font-semibold hover:text-accent-hover shrink-0"
          >
            Modifier
          </button>
        </div>

        <input
          name="website"
          type="hidden"
          value={formData.website}
          onChange={handleChange}
          tabIndex={-1}
          autoComplete="off"
        />

        <div>
          <label htmlFor="booking-name" className="block text-text-primary text-sm font-medium mb-1">
            Nom
          </label>
          <input
            id="booking-name"
            name="name"
            type="text"
            placeholder="Votre nom"
            value={formData.name}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.name}
            className={inputClass}
          />
          {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="booking-email" className="block text-text-primary text-sm font-medium mb-1">
            Email
          </label>
          <input
            id="booking-email"
            name="email"
            type="email"
            placeholder="Votre email"
            value={formData.email}
            onChange={handleChange}
            aria-required="true"
            aria-invalid={!!errors.email}
            className={inputClass}
          />
          {errors.email && <p className="text-error text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <label htmlFor="booking-message" className="block text-text-primary text-sm font-medium mb-1">
            Sujet (optionnel)
          </label>
          <textarea
            id="booking-message"
            name="message"
            placeholder="En quelques mots : votre projet, votre besoin"
            value={formData.message}
            onChange={handleChange}
            rows={3}
            className={`${inputClass} resize-none`}
          />
        </div>

        {errors._global && <p className="text-error text-sm">{errors._global}</p>}

        <button
          type="submit"
          disabled={submitting}
          aria-busy={submitting}
          className="w-full bg-accent text-bg-primary font-semibold rounded-lg px-6 py-3 hover:bg-accent-hover transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? "Réservation en cours..." : "Confirmer le rendez-vous"}
        </button>
      </form>
    )
  }

  // ----- Sélecteur jour / créneau -----
  return (
    <div className="max-w-[600px] mx-auto">
      {conflictMessage && (
        <p role="alert" className="text-error text-sm text-center mb-4">
          {conflictMessage}
        </p>
      )}

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6" role="tablist" aria-label="Choisir un jour">
        {[...days.keys()].map((dayKey) => {
          const first = days.get(dayKey)![0]
          const isSelected = dayKey === selectedDay
          return (
            <button
              key={dayKey}
              type="button"
              data-testid="booking-day"
              role="tab"
              aria-selected={isSelected}
              onClick={() => setSelectedDay(dayKey)}
              className={`shrink-0 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                isSelected
                  ? "border-accent bg-accent text-bg-primary"
                  : "border-border text-text-secondary hover:border-accent hover:text-text-primary"
              }`}
            >
              {dayLabelFormat.format(new Date(first.start))}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {daySlots.map((slot) => (
          <button
            key={slot.start}
            type="button"
            onClick={() => {
              setConflictMessage(null)
              setSelectedSlot(slot)
            }}
            className="rounded-lg border border-border px-3 py-2 text-sm font-medium text-text-primary hover:border-accent hover:text-accent transition-colors"
          >
            {timeFormat.format(new Date(slot.start))}
          </button>
        ))}
      </div>
    </div>
  )
}
