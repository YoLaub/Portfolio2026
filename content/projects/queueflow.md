---
id: queueflow
title: QueueFlow
description: SaaS multi-tenant qui aide les petits fast foods à gérer séparément leurs commandes en direct et à distance, en temps réel, avec un agent IA branchable pour la prise de commande.
longDescription: "SaaS multi-tenant pour fast foods : le gérant, le staff cuisine et les clients en salle voient en temps réel où en sont les commandes prises au comptoir et celles reçues à distance (téléphone, WhatsApp, livraison). Isolation stricte par restaurant (RLS PostgreSQL, JWT scopé), temps réel via Pusher Channels, gestion d'équipe, plannings et suivi du chiffre d'affaires. Un serveur MCP expose la prise de commande à distance à un agent conversationnel externe, avec des tokens par restaurant générés et révocables par le gérant."
techStack:
  - Next.js
  - PostgreSQL
  - Drizzle ORM
  - Pusher
  - Better Auth
  - MCP
image: /images/projects/queueflow.webp
platform: web
order: 0
---

SaaS multi-tenant de gestion de commandes pour fast foods : deux files (comptoir et à distance) suivies en temps réel par le gérant, le staff cuisine et les écrans clients. Isolation multi-tenant appliquée côté serveur (RLS + claim JWT), temps réel via Pusher Channels, et modules de gestion d'équipe, plannings et chiffre d'affaires.

Un serveur MCP (Model Context Protocol) branche un agent IA de prise de commande à distance (téléphone, WhatsApp...) directement sur le système : le gérant peut créer et révoquer des tokens d'agent par restaurant depuis les réglages, chaque appel étant limité en débit et cloisonné par tenant (le token détermine le restaurant, jamais un paramètre fourni par l'agent).
