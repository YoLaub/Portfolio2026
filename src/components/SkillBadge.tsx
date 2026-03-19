import { SkillData } from "@/data/skills"

export function SkillBadge({
  skill,
  size = "md",
}: {
  skill: SkillData
  size?: "sm" | "md"
}) {
  return (
    <span
      className={`inline-block bg-accent-soft text-accent font-mono rounded-lg ${
        size === "sm" ? "px-2 py-1 text-xs" : "px-3 py-1.5 text-sm"
      }`}
    >
      {skill.name}
    </span>
  )
}
