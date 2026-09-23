import { test, expect } from "@playwright/test"

test.describe("Page d'accueil", () => {
  test("charge sans erreur et affiche le H1 de positionnement", async ({ page }) => {
    const errors: string[] = []
    page.on("pageerror", (err) => errors.push(err.message))

    await page.goto("/")

    await expect(page.getByRole("heading", { level: 1 })).toContainText(/programmer/i)
    expect(errors).toEqual([])
  })

  test("la pastille de dispo du Hero est absente tant que l'agenda n'est pas configuré", async ({
    page,
  }) => {
    await page.goto("/")
    // En local (pas de Google configuré) : /api/booking/slots renvoie 503,
    // la pastille reste masquée plutôt que d'afficher une fausse info.
    await expect(page.getByText(/^(Disponible|Indisponible)$/)).toHaveCount(0)
  })
})
