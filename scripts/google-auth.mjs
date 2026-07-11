#!/usr/bin/env node
// Script one-shot : obtenir le GOOGLE_REFRESH_TOKEN pour la prise de RDV.
//
// Prérequis (une seule fois, ~10 min) :
//   1. https://console.cloud.google.com -> créer un projet (ou en réutiliser un)
//   2. "APIs & Services" -> activer "Google Calendar API"
//   3. "OAuth consent screen" -> External -> ajouter votre email en test user
//   4. "Credentials" -> "Create credentials" -> "OAuth client ID" -> type "Web application"
//      -> Authorized redirect URI : http://localhost:53682/callback
//   5. Reporter Client ID / Client Secret dans .env.local
//
// Usage :
//   node scripts/google-auth.mjs
//   (lit GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET dans .env.local ou l'environnement)
//
// Le script ouvre une URL de consentement, récupère le code sur le port local,
// l'échange contre un refresh token et l'affiche : copiez-le dans .env.local
// (et dans les variables d'environnement Vercel).

import http from "node:http"
import { readFileSync, existsSync } from "node:fs"

const PORT = 53682
const REDIRECT_URI = `http://localhost:${PORT}/callback`
const SCOPES = [
  "https://www.googleapis.com/auth/calendar.events",
  "https://www.googleapis.com/auth/calendar.freebusy",
].join(" ")

function loadEnvLocal() {
  if (!existsSync(".env.local")) return
  for (const line of readFileSync(".env.local", "utf-8").split("\n")) {
    const match = line.match(/^([A-Z_]+)=(.*)$/)
    if (match && !process.env[match[1]]) {
      process.env[match[1]] = match[2].trim()
    }
  }
}

loadEnvLocal()

const clientId = process.env.GOOGLE_CLIENT_ID
const clientSecret = process.env.GOOGLE_CLIENT_SECRET

if (!clientId || !clientSecret) {
  console.error(
    "GOOGLE_CLIENT_ID et GOOGLE_CLIENT_SECRET manquants (dans .env.local ou l'environnement).\n" +
      "Voir les instructions en tête de ce script."
  )
  process.exit(1)
}

const authUrl =
  "https://accounts.google.com/o/oauth2/v2/auth?" +
  new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: SCOPES,
    access_type: "offline",
    prompt: "consent",
  }).toString()

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, REDIRECT_URI)
  if (url.pathname !== "/callback") {
    res.writeHead(404).end()
    return
  }

  const code = url.searchParams.get("code")
  if (!code) {
    res.writeHead(400).end("Code manquant.")
    return
  }

  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }),
    })
    const tokens = await tokenRes.json()

    if (!tokens.refresh_token) {
      throw new Error(
        "Pas de refresh_token dans la réponse (révoquez l'accès sur myaccount.google.com/permissions et relancez)."
      )
    }

    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" })
    res.end("<h1>OK</h1><p>Refresh token obtenu, retournez dans le terminal.</p>")

    console.log("\n=== Succès ===")
    console.log("Ajoutez cette ligne dans .env.local (et dans Vercel) :\n")
    console.log(`GOOGLE_REFRESH_TOKEN=${tokens.refresh_token}\n`)
  } catch (error) {
    res.writeHead(500).end(String(error))
    console.error("Échec de l'échange du code :", error)
  } finally {
    server.close()
  }
})

server.listen(PORT, () => {
  console.log("Ouvrez cette URL dans votre navigateur (compte Google du calendrier) :\n")
  console.log(authUrl + "\n")
  console.log(`En attente du retour Google sur ${REDIRECT_URI} ...`)
})
