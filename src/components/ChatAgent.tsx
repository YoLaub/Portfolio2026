"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { motion, AnimatePresence, useReducedMotion } from "motion/react"

// ─── Types locaux miroir des types API ───────────────────────────────
interface ProjectMeta {
  id: string
  title: string
  techStack: string[]
  image: string
  liveUrl?: string
  githubUrl?: string
}

interface ProjectContent extends ProjectMeta {
  content: string
}

interface SkillData {
  id: string
  name: string
  category: string
}

interface ServiceData {
  id: string
  title: string
  description: string
  icon: string
}

// ─── Chat types ──────────────────────────────────────────────────────
interface ChatAction {
  label: string
  onClick: () => void
}

interface ChatMessage {
  id: string
  type: "bot" | "user-action"
  content: React.ReactNode
  actions?: ChatAction[]
}

// ─── Composant ChatAgent ─────────────────────────────────────────────
export function ChatAgent() {
  const prefersReduced = useReducedMotion()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [lastFailedAction, setLastFailedAction] = useState<(() => void) | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // P6 — msgCounter en useRef au lieu de module-level
  const msgCounterRef = useRef(0)
  function nextId() {
    return `msg-${++msgCounterRef.current}`
  }

  // P2 — Guard pour ne pas voler le focus au mount initial
  const wasOpenRef = useRef(false)

  // P4 — AbortController pour annuler les fetches en cours
  const abortRef = useRef<AbortController | null>(null)

  // Scroll automatique vers le bas quand les messages changent
  useEffect(() => {
    if (typeof messagesEndRef.current?.scrollIntoView === "function") {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isLoading, error])

  // P2 — Focus retour sur le bouton uniquement après fermeture (pas au mount)
  useEffect(() => {
    if (!isOpen && wasOpenRef.current) {
      buttonRef.current?.focus()
    }
    wasOpenRef.current = isOpen
  }, [isOpen])

  // P1 — Focus trap : piéger Tab/Shift+Tab dans le panneau + Escape pour fermer
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsOpen(false)
        return
      }
      if (e.key === "Tab" && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first.focus()
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  // Cleanup abort on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  // ─── Actions du menu principal ──────────────────────────────────
  const addBotMessage = useCallback(
    (content: React.ReactNode, actions?: ChatAction[]) => {
      setMessages((prev) => [...prev, { id: nextId(), type: "bot", content, actions }])
    },
    [] // eslint-disable-line react-hooks/exhaustive-deps
  )

  const addUserAction = useCallback((label: string) => {
    setMessages((prev) => [...prev, { id: nextId(), type: "user-action", content: label }])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // P3 — Utiliser des refs pour les handlers afin d'éviter les closures périmées
  const handlersRef = useRef<{
    projects: () => void
    skills: () => void
    services: () => void
    contact: () => void
    cv: () => void
    showWelcome: () => void
  }>({
    projects: () => {},
    skills: () => {},
    services: () => {},
    contact: () => {},
    cv: () => {},
    showWelcome: () => {},
  })

  const showWelcome = useCallback(() => {
    setError(null)
    setIsLoading(false)
    abortRef.current?.abort()
    setMessages([])

    const welcomeActions: ChatAction[] = [
      { label: "Mes Projets", onClick: () => handlersRef.current.projects() },
      { label: "Mes Compétences", onClick: () => handlersRef.current.skills() },
      { label: "Mes Services", onClick: () => handlersRef.current.services() },
      { label: "Me Contacter", onClick: () => handlersRef.current.contact() },
      { label: "Télécharger CV", onClick: () => handlersRef.current.cv() },
    ]

    setMessages([
      {
        id: nextId(),
        type: "bot",
        content: "Bonjour ! Je suis l'assistant de Yoann. Comment puis-je vous aider ?",
        actions: welcomeActions,
      },
    ])
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // Initialiser le message d'accueil à l'ouverture
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      showWelcome()
    }
  }, [isOpen]) // eslint-disable-line react-hooks/exhaustive-deps

  const backToMenuAction: ChatAction = {
    label: "Retour au menu",
    onClick: () => handlersRef.current.showWelcome(),
  }

  // ─── Fetch wrapper avec loading/error + AbortController ─────────
  async function fetchApi<T>(url: string, action: () => void): Promise<T | null> {
    // P4 — Annuler le fetch précédent et guard loading
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsLoading(true)
    setError(null)
    setLastFailedAction(() => action)
    try {
      const res = await fetch(url, { signal: controller.signal })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = (await res.json()) as T
      setIsLoading(false)
      return data
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") {
        return null
      }
      setIsLoading(false)
      setError("Oups, une erreur s'est produite")
      return null
    }
  }

  // ─── Handlers arbre de décision ─────────────────────────────────
  function handleProjects() {
    // P4 — Guard anti-double clic
    if (isLoading) return
    addUserAction("Mes Projets")
    const action = async () => {
      const projects = await fetchApi<ProjectMeta[]>("/api/portfolio/projects", action)
      if (!projects) return

      // P7 — Feedback si liste vide
      if (projects.length === 0) {
        addBotMessage("Aucun projet trouvé pour le moment.", [backToMenuAction])
        return
      }

      const projectActions: ChatAction[] = projects.map((p) => ({
        label: `En savoir plus : ${p.title}`,
        onClick: () => handleProjectDetail(p.id, p.title),
      }))
      projectActions.push(backToMenuAction)

      addBotMessage(
        <div>
          <p className="font-semibold mb-2">Voici mes projets :</p>
          <ul className="space-y-1">
            {projects.map((p) => (
              <li key={p.id} className="text-text-secondary">
                <span className="text-text-primary font-medium">{p.title}</span>
                {" — "}
                {p.techStack.join(", ")}
              </li>
            ))}
          </ul>
        </div>,
        projectActions
      )
    }
    action()
  }

  function handleProjectDetail(id: string, title: string) {
    if (isLoading) return
    addUserAction(`En savoir plus : ${title}`)
    const action = async () => {
      const project = await fetchApi<ProjectContent>(`/api/portfolio/projects/${id}`, action)
      if (!project) return

      addBotMessage(
        <div>
          <p className="font-semibold text-lg mb-1">{project.title}</p>
          <p className="text-text-secondary mb-2">{project.content}</p>
          <p className="text-sm mb-1">
            <span className="font-medium">Stack :</span> {project.techStack.join(", ")}
          </p>
          <div className="flex gap-3 mt-2 flex-wrap">
            {project.githubUrl && (
              <a
                href={project.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover underline text-sm"
              >
                GitHub
              </a>
            )}
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent hover:text-accent-hover underline text-sm"
              >
                Démo
              </a>
            )}
          </div>
        </div>,
        [backToMenuAction]
      )
    }
    action()
  }

  function handleSkills() {
    if (isLoading) return
    addUserAction("Mes Compétences")
    const action = async () => {
      const skills = await fetchApi<SkillData[]>("/api/portfolio/skills", action)
      if (!skills) return

      if (skills.length === 0) {
        addBotMessage("Aucune compétence trouvée pour le moment.", [backToMenuAction])
        return
      }

      const grouped: Record<string, string[]> = {}
      for (const s of skills) {
        if (!grouped[s.category]) grouped[s.category] = []
        grouped[s.category].push(s.name)
      }

      addBotMessage(
        <div>
          <p className="font-semibold mb-2">Mes compétences :</p>
          {Object.entries(grouped).map(([cat, names]) => (
            <div key={cat} className="mb-2">
              <p className="font-medium text-accent">{cat}</p>
              <p className="text-text-secondary text-sm">{names.join(", ")}</p>
            </div>
          ))}
        </div>,
        [backToMenuAction]
      )
    }
    action()
  }

  function handleServices() {
    if (isLoading) return
    addUserAction("Mes Services")
    const action = async () => {
      const services = await fetchApi<ServiceData[]>("/api/portfolio/services", action)
      if (!services) return

      if (services.length === 0) {
        addBotMessage("Aucun service trouvé pour le moment.", [backToMenuAction])
        return
      }

      addBotMessage(
        <div>
          <p className="font-semibold mb-2">Mes services :</p>
          <ul className="space-y-2">
            {services.map((s) => (
              <li key={s.id}>
                <p className="font-medium text-text-primary">{s.title}</p>
                <p className="text-text-secondary text-sm">{s.description}</p>
              </li>
            ))}
          </ul>
        </div>,
        [backToMenuAction]
      )
    }
    action()
  }

  function handleContact() {
    addUserAction("Me Contacter")
    addBotMessage(
      <div>
        <p className="font-semibold mb-2">Comment me contacter :</p>
        <ul className="space-y-2">
          <li>
            <a
              href="https://calendly.com/yoann-laubert"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:text-accent-hover underline"
            >
              Prendre rendez-vous (Calendly)
            </a>
          </li>
          <li>
            <a href="#contact" className="text-accent hover:text-accent-hover underline" onClick={() => setIsOpen(false)}>
              Formulaire de contact
            </a>
          </li>
          <li>
            <a href="mailto:contact@yoann-laubert.dev" className="text-accent hover:text-accent-hover underline">
              contact@yoann-laubert.dev
            </a>
          </li>
        </ul>
      </div>,
      [backToMenuAction]
    )
  }

  // P5 — CV download via lien dans le message au lieu de createElement
  function handleCV() {
    addUserAction("Télécharger CV")
    addBotMessage(
      <div>
        <p className="mb-2">Téléchargez mon CV :</p>
        <a
          href="/cv.pdf"
          download="cv.pdf"
          className="text-accent hover:text-accent-hover underline font-medium"
        >
          Télécharger le CV (PDF)
        </a>
      </div>,
      [backToMenuAction]
    )
  }

  // P3 — Mettre à jour les refs des handlers à chaque render
  handlersRef.current = {
    projects: handleProjects,
    skills: handleSkills,
    services: handleServices,
    contact: handleContact,
    cv: handleCV,
    showWelcome,
  }

  function handleRetry() {
    if (lastFailedAction) {
      setError(null)
      lastFailedAction()
    }
  }

  // ─── Animation config ──────────────────────────────────────────
  const panelInitial = prefersReduced ? undefined : { opacity: 0, y: 20, scale: 0.95 }
  const panelAnimate = prefersReduced ? undefined : { opacity: 1, y: 0, scale: 1 }
  const panelExit = prefersReduced ? undefined : { opacity: 0, y: 20, scale: 0.95 }
  const panelTransition = prefersReduced ? undefined : { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] as const }
  const buttonHover = prefersReduced ? undefined : { scale: 1.1 }
  const buttonTap = prefersReduced ? undefined : { scale: 0.95 }

  // ─── Rendu ─────────────────────────────────────────────────────
  return (
    <>
      {/* Bouton flottant */}
      <motion.button
        ref={buttonRef}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-accent text-bg-primary shadow-lg flex items-center justify-center cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? "Fermer le chat" : "Ouvrir le chat"}
        whileHover={buttonHover}
        whileTap={buttonTap}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </motion.button>

      {/* Panneau de chat */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Assistant chat"
            className="fixed bottom-24 right-6 z-50 w-80 sm:w-96 max-h-[70vh] flex flex-col rounded-2xl bg-bg-elevated border border-border shadow-2xl overflow-hidden"
            initial={panelInitial}
            animate={panelAnimate}
            exit={panelExit}
            transition={panelTransition}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-secondary">
              <span className="font-semibold text-text-primary text-sm">Assistant Yoann</span>
              <button
                onClick={() => setIsOpen(false)}
                className="text-text-secondary hover:text-text-primary cursor-pointer"
                aria-label="Fermer le chat"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" aria-live="polite">
              {messages.map((msg) => (
                <div key={msg.id} className={msg.type === "user-action" ? "flex justify-end" : ""}>
                  {msg.type === "user-action" ? (
                    <div className="bg-accent text-bg-primary text-sm px-3 py-1.5 rounded-xl max-w-[80%]">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="bg-bg-secondary text-text-primary text-sm px-3 py-2.5 rounded-xl max-w-[90%]">
                      {msg.content}
                      {msg.actions && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {/* P8 — key avec index pour éviter les collisions */}
                          {msg.actions.map((action, idx) => (
                            <button
                              key={`${action.label}-${idx}`}
                              onClick={action.onClick}
                              className="bg-accent text-bg-primary text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-accent-hover transition-colors cursor-pointer"
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}

              {/* Loading */}
              {isLoading && (
                <div className="flex items-center gap-2 text-text-secondary text-sm" role="status">
                  <div className="w-4 h-4 border-2 border-accent border-t-transparent rounded-full animate-spin" />
                  Chargement...
                </div>
              )}

              {/* Erreur */}
              {error && (
                <div className="bg-bg-secondary text-sm px-3 py-2.5 rounded-xl">
                  <p className="text-error mb-2">{error}</p>
                  <button
                    onClick={handleRetry}
                    className="bg-accent text-bg-primary text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-accent-hover transition-colors cursor-pointer"
                  >
                    Réessayer
                  </button>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
