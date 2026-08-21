# Authentification pour les agents IA

Aucune authentification n'est requise pour consulter ce site ou utiliser
son serveur MCP (Model Context Protocol).

## Lecture des donnees

- API REST : `https://yl-solution.fr/api/portfolio/*` (profil, projets,
  competences, formation, services) - acces public, pas de cle requise.
- Profil complet en Markdown : `https://yl-solution.fr/ai.md`
- Documentation OpenAPI : `https://yl-solution.fr/api/docs`
- Serveur MCP (transport Streamable HTTP) : `https://yl-solution.fr/api/mcp`
  - resources : `yl://profile`, `yl://services`, `yl://skills`,
    `yl://formation`, `yl://projects`
  - tool : `contact_yoann`

## Outil `contact_yoann`

Le seul outil avec effet de bord (envoi d'un email) est `contact_yoann`.
Il ne necessite pas de cle d'API, mais :

- il est limite en frequence (rate limit) par adresse IP appelante, pour
  eviter les abus ;
- les champs `name`, `email` et `message` sont valides cote serveur
  (formats, longueurs, anti-injection) avant tout envoi.

Aucun jeton, cookie de session ou header d'autorisation n'est attendu sur
aucune de ces routes.
