# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repository is

This is the semester-long project for **DSY1104 (Desarrollo Full Stack II)**. It is **one single project that evolves in place** across four graded stages — it is not a series of independent projects, and code from an earlier stage must never be deleted to "start fresh" for the next one.

The chosen case is **Forma A: HuertoHogar**, a Chilean online store selling fresh farm products (fruit, organic vegetables, organic goods, dairy). Full case brief, functional requirements, and visual design spec live in `CONTENIDO_CLASES/DSY1104 - Forma A tienda HUERTO HOGAR.pdf`; the semester rules live in `CONTENIDO_CLASES/00_Instrucciones_Generales_Proyecto_Semestral_DSY1104.docx`.

As of now the repository contains only the assignment briefs — no application code exists yet. The first implementation work will be **EV1** (see below), which should create the `frontend/` folder.

## Stage roadmap (do not skip ahead or throw away prior stages)

| Stage | Adds | Tech |
|---|---|---|
| EV1 | Base front-end | HTML + CSS + vanilla JavaScript, forms, shopping cart persisted via `localStorage` |
| EV2 | Front-end evolution | Migrate the EV1 UI to React: reusable components, props/state, routing, Bootstrap/responsive layout, CRUD against simulated/mock data, tests |
| EV3 | Full stack integration | Add a Spring Boot backend + MySQL database, REST API, Swagger docs, JWT auth, roles/permissions; wire the React front-end to the real API |
| ET (Examen Transversal) | Closing | Finish anything left from EV3, fix bugs, verify full frontend+backend+DB integration — no new project |

Target repo layout as stages are added (create folders only when that stage's tech is introduced — empty placeholder folders are not needed ahead of time):

```
frontend/
backend/
database/
documentacion/
```

`documentacion/` should hold the ERS (Especificación de Requisitos de Software), which is filled in progressively (started in EV1, updated in EV2, near-complete in EV3, final at ET) — it must describe the system as actually built, not an aspirational design.

## Working conventions for this repo

- Commit frequently with descriptive messages describing the actual change — avoid a single giant end-of-stage commit.
- Never delete or rewrite-from-scratch a previous stage's work; extend/migrate it instead (e.g. EV2 migrates the EV1 HTML/CSS/JS into React components rather than starting a new app).
- Keep the current stage's scope in mind: don't pull in EV2/EV3 tech (React, Spring Boot, MySQL) while EV1 (plain HTML/CSS/JS) is the active stage, and vice versa — check which stage is currently being worked on before introducing a new framework.

## HuertoHogar business/domain data

Use this as the source of truth for seed data — it comes directly from the case brief so future work doesn't need to re-derive it.

**Categories**: Frutas Frescas, Verduras Orgánicas, Productos Orgánicos, Productos Lácteos

**Products**:
| Code | Product | Price | Stock |
|---|---|---|---|
| FR001 | Manzanas Fuji | $1.200 CLP/kilo | 150 kilos |
| FR002 | Naranjas Valencia | $1.000 CLP/kilo | 200 kilos |
| FR003 | Plátanos Cavendish | $800 CLP/kilo | 250 kilos |
| VR001 | Zanahorias Orgánicas | $900 CLP/kilo | 100 kilos |
| VR002 | Espinacas Frescas | $700 CLP/bolsa 500g | 80 bolsas |
| VR003 | Pimientos Tricolores | $1.500 CLP/kilo | 120 kilos |
| PO001 | Miel Orgánica | $5.000 CLP/frasco 500g | 50 frascos |
| PO003 | Quinua Orgánica | — | — |
| PL001 | Leche Entera | — | — |

**Store locations** (used for an "about us" map): Santiago, Puerto Montt, Villarica, Nacimiento, Viña del Mar, Valparaíso, Concepción.

**Core functional requirements** from the brief: user registration/auth by email+password, user profile management (delivery address, contact number), product catalog with category filters, shopping cart (add/remove/modify, totals), order confirmation + receipt generation, order status notifications, real-time shipment tracking with preferred delivery date selection, product reviews/ratings.

**Visual design spec**:
- Background: soft white `#F7F7F7`
- Accents: emerald green `#2E8B57` (buttons/links/interactive), mustard yellow `#FFD700` (promos/offers), light brown `#8B4513` (titles/subtitles)
- Text: dark gray `#333333` (primary), medium gray `#666666` (secondary)
- Fonts: [Montserrat](https://fonts.google.com/specimen/Montserrat) for body text, [Playfair Display](https://fonts.google.com/specimen/Playfair+Display) for headings
- Tone: fresh/natural imagery, subtle recycled-paper texture, product origin + sustainability info, purchase history, personalized recommendations, carbon-footprint messaging per purchase

## Commands

No build/lint/test tooling exists yet since no code has been written. Once the EV1 frontend (or later stages) is scaffolded, this section should be updated with the actual commands (e.g. how to serve the static site, `npm run dev`/`npm test` once React is introduced in EV2, or Maven/Gradle commands once Spring Boot is introduced in EV3).
