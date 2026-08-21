"use client"

import { useId, useState } from "react"
import type { ServiceData } from "@/data/services"
import { GlassModal } from "@/components/GlassModal"
import { getServiceIcon } from "@/components/ServiceIcon"

export function ServiceCard({ service }: { service: ServiceData }) {
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const titleId = useId()

  return (
    <article className="h-full flex flex-col bg-bg-secondary border border-border rounded-xl p-6 hover:border-accent transition-colors duration-200">
      <div className="text-accent mb-4">
        {getServiceIcon(service.icon)}
      </div>
      <h3 className="text-lg font-semibold text-text-primary mb-2">
        {service.title}
      </h3>
      <p className="text-text-secondary leading-relaxed">
        {service.description}
      </p>
      {service.detail && (
        <>
          <button
            type="button"
            onClick={() => setIsDetailOpen(true)}
            className="mt-3 self-start text-sm font-medium text-accent hover:underline cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
          >
            En savoir plus
          </button>
          <GlassModal
            isOpen={isDetailOpen}
            onClose={() => setIsDetailOpen(false)}
            title={service.title}
            titleId={titleId}
          >
            <p>{service.detail}</p>
          </GlassModal>
        </>
      )}
      {service.price && (
        <p
          data-testid="service-price"
          className="mt-auto pt-4 border-t border-border text-accent font-semibold"
        >
          {service.price}
        </p>
      )}
    </article>
  )
}
