"use client"

import { useId, useState } from "react"

// Hypothese de calcul : jours ouvres moyens par mois (base France).
const WORKING_DAYS_PER_MONTH = 21
// Estimation d'un projet d'automatisation type, pour donner un ordre de
// grandeur de "temps de retour sur investissement" (3 jours au TJM
// automatisation, cf content/services.json). Volontairement approximatif :
// le vrai chiffrage se fait en echange direct ("Discuter de votre projet").
const AVERAGE_PROJECT_COST = 3 * 400

interface SliderFieldProps {
  id: string
  label: string
  description: string
  value: number
  min: number
  max: number
  step: number
  unit: string
  onChange: (value: number) => void
}

function SliderField({ id, label, description, value, min, max, step, unit, onChange }: SliderFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block font-semibold text-text-primary mb-1">
        {label}
      </label>
      <p className="text-text-secondary text-sm mb-3">{description}</p>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-accent cursor-pointer"
      />
      <p className="text-right text-sm font-medium text-text-primary mt-1">
        {value} {unit}
      </p>
    </div>
  )
}

interface RoiSimulatorProps {
  compact?: boolean
}

export function RoiSimulator({ compact = false }: RoiSimulatorProps) {
  const [duration, setDuration] = useState(30)
  const [frequency, setFrequency] = useState(3)
  const [hourlyCost, setHourlyCost] = useState(25)
  const idPrefix = useId()

  const monthlyMinutes = duration * frequency * WORKING_DAYS_PER_MONTH
  const monthlyHours = monthlyMinutes / 60
  const monthlySavings = Math.round(monthlyHours * hourlyCost)
  const yearlySavings = monthlySavings * 12
  const paybackMonths = monthlySavings > 0 ? Math.max(1, Math.ceil(AVERAGE_PROJECT_COST / monthlySavings)) : null

  const gridClass = compact ? "flex flex-col gap-5" : "grid grid-cols-1 sm:grid-cols-3 gap-8"
  const resultsClass = compact ? "flex flex-col gap-4" : "grid grid-cols-1 sm:grid-cols-3 gap-8"

  return (
    <div>
      <div className={gridClass}>
        <SliderField
          id={`${idPrefix}-duration`}
          label="Durée de la tâche"
          description="Le temps nécessaire pour la réaliser."
          value={duration}
          min={5}
          max={120}
          step={5}
          unit="min"
          onChange={setDuration}
        />
        <SliderField
          id={`${idPrefix}-frequency`}
          label="Fréquence"
          description="Le nombre de fois par jour."
          value={frequency}
          min={1}
          max={10}
          step={1}
          unit="fois / jour"
          onChange={setFrequency}
        />
        <SliderField
          id={`${idPrefix}-cost`}
          label="Coût horaire"
          description="Le salaire chargé de la personne concernée."
          value={hourlyCost}
          min={15}
          max={60}
          step={1}
          unit="€ / heure"
          onChange={setHourlyCost}
        />
      </div>

      <div className={`${resultsClass} mt-8 pt-6 border-t border-border`}>
        <div>
          <p className="text-text-secondary text-sm mb-1">Économie sur 1 mois</p>
          <p className="text-2xl font-bold text-accent">{monthlySavings.toLocaleString("fr-FR")} €</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm mb-1">Économie sur 1 an</p>
          <p className="text-2xl font-bold text-accent">{yearlySavings.toLocaleString("fr-FR")} €</p>
        </div>
        <div>
          <p className="text-text-secondary text-sm mb-1">Rentabilisé en</p>
          <p className="text-2xl font-bold text-accent">
            {paybackMonths !== null ? `≈ ${paybackMonths} mois` : "N/A"}
          </p>
        </div>
      </div>

      <p className="text-text-secondary text-xs mt-6">
        Estimation indicative (base 21 jours ouvrés / mois, projet d&apos;automatisation type de 3
        jours). Le chiffrage précis se fait en échangeant sur votre besoin.
      </p>
    </div>
  )
}
