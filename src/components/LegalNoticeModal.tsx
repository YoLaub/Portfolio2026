"use client"

import { GlassModal } from "@/components/GlassModal"

const MODAL_TITLE_ID = "legal-notice-title"

interface LegalNoticeModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LegalNoticeModal({ isOpen, onClose }: LegalNoticeModalProps) {
  return (
    <GlassModal isOpen={isOpen} onClose={onClose} title="Mentions légales" titleId={MODAL_TITLE_ID}>
      <div className="space-y-5">
        <section>
          <h3 className="mb-1.5 font-semibold text-text-primary">Éditeur du site</h3>
          <p>
            Yoann Laubert, entrepreneur individuel (micro-entreprise)
            <br />
            SIRET : [EN COURS]
            <br />
            Adresse :Vannes, Bretagne, France
            <br />
            Contact :{" "}
            <a href="mailto:ylsolution.web@gmail.com" className="text-accent hover:underline">
              ylsolution.web@gmail.com
            </a>
          </p>
        </section>

        <section>
          <h3 className="mb-1.5 font-semibold text-text-primary">Directeur de la publication</h3>
          <p>Yoann Laubert</p>
        </section>

        <section>
          <h3 className="mb-1.5 font-semibold text-text-primary">Hébergement</h3>
          <p>
            Hetzner Online GmbH
            <br />
            Industriestraße 25, 91710 Fürth, Allemagne
            <br />
            Site hébergé sur un serveur privé exploité par l&apos;éditeur.
          </p>
        </section>

        <section>
          <h3 className="mb-1.5 font-semibold text-text-primary">Propriété intellectuelle</h3>
          <p>
            L&apos;ensemble des contenus de ce site (textes, visuels, code) est la propriété de
            Yoann Laubert, sauf mention contraire, et ne peut être reproduit sans autorisation
            préalable.
          </p>
        </section>

        <section>
          <h3 className="mb-1.5 font-semibold text-text-primary">Données personnelles</h3>
          <p>
            Les informations transmises via le formulaire de contact ou de prise de rendez-vous
            ne sont utilisées que pour répondre à votre demande et ne sont ni cédées, ni
            revendues à des tiers. Conformément au RGPD, vous disposez d&apos;un droit
            d&apos;accès, de rectification et de suppression de vos données en écrivant à
            l&apos;adresse ci-dessus.
          </p>
        </section>
      </div>
    </GlassModal>
  )
}
