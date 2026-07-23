---
id: queueflow
title: QueueFlow
description: SaaS multi-tenant qui aide les petits fast foods à gérer séparément leurs commandes en direct et à distance, en temps réel.
longDescription: "SaaS multi-tenant pour fast foods : le gérant, le staff cuisine et les clients en salle voient en temps réel où en sont les commandes prises au comptoir et celles reçues à distance (téléphone, WhatsApp, livraison). Isolation stricte par restaurant (RLS PostgreSQL, JWT scopé), temps réel via Pusher Channels, gestion d'équipe, plannings et suivi du chiffre d'affaires."
techStack:
  - Next.js
  - PostgreSQL
  - Drizzle ORM
  - Pusher
  - Better Auth
image: /images/projects/queueflow.webp
platform: web
---

SaaS multi-tenant de gestion de commandes pour fast foods : deux files (comptoir et à distance) suivies en temps réel par le gérant, le staff cuisine et les écrans clients. Isolation multi-tenant appliquée côté serveur (RLS + claim JWT), temps réel via Pusher Channels, et modules de gestion d'équipe, plannings et chiffre d'affaires.
