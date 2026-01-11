# AGENTS.md

## Project Overview

**OnePlaylist** is a web application for creating and managing playlists that span multiple music streaming platforms.

The core mission is to reduce platform lock-in by giving users a unified, platform-agnostic way to organize, sync, and share music.

This document defines architectural, stylistic, and behavioral rules that all agents and contributors must follow.

---

## Design Philosophy

### Visual Style

OnePlaylist uses a **neo-brutalist UI style**, implemented on top of **shadcn/ui components** for scalability and maintainability.

Neo-brutalist principles to follow:

- High contrast colors
- Flat surfaces (minimal gradients, minimal shadows)
- Thick borders (2–3px)
- Hard edges (little to no border radius unless intentional)
- Visible structure and hierarchy
- UI should feel bold, opinionated, and slightly raw

Avoid:

- Soft shadows
- Excessive blur
- Overly rounded components
- Subtle gray-on-gray palettes

---

### shadcn/ui Usage Rules

shadcn components are used as foundations, not final designs.

Agents must:

- Override default styles to match neo-brutalist rules
- Prefer global design tokens over per-component hacks
- Keep component APIs compatible with upstream shadcn patterns

Example principles:

- Buttons should use strong background colors and visible borders
- Cards should look like panels, not floating elements
- Inputs should feel mechanical and intentional

Do not replace shadcn with custom UI libraries unless explicitly instructed.

---

## Tech Stack

Agents should assume the following stack unless otherwise specified:

- Next.js (App Router)
- NextAuth.js
- tRPC
- Prisma
- Drizzle ORM
- Tailwind CSS
- shadcn/ui

All code should be type-safe, composable, and framework-aligned.

---

## Feature Scope

Agents may work on:

- Authentication with supported music platforms
- Cross-platform playlist creation
- Track syncing and normalization
- UI for playlist and track management

Agents should not introduce features that:

- Lock users into a single platform
- Duplicate native streaming-app UX
- Violate third-party platform terms

---

## Integrations

### Current

- Spotify
- SoundCloud

### Planned

- Bandcamp

Integration logic should be adapter-based, keeping platform-specific logic isolated from core playlist logic.

---

## SDK Usage

Preferred SDKs:

- @spotify/web-api-ts-sdk
- soundcloud.ts

Agents should:

- Wrap SDK calls in service layers
- Avoid calling SDKs directly from UI components
- Normalize external data into internal domain models

---

## Code Style & Architecture Rules

- Prefer composition over inheritance
- Prefer small, focused components
- No business logic inside UI components
- Keep platform-specific logic isolated
- Avoid premature abstraction
- Avoid cleverness at the expense of clarity

---

## Agent Behavior Guidelines

Agents should:

- Follow existing patterns before introducing new ones
- Ask before making breaking architectural changes
- Keep diffs small and reviewable
- Optimize for readability and maintainability

Agents should not:

- Redesign the UI away from neo-brutalism
- Introduce new styling paradigms without approval
- Mix styling approaches inconsistently

---

## Design Consistency Rules

If building new UI components:

- Start with shadcn
- Apply neo-brutalist styling consistently
- Reuse existing tokens, spacing, and typography
- Validate accessibility with contrast checks

---

## Future Considerations

The project is expected to grow to include:

- More platforms
- Public playlist sharing
- Collaborative features

All additions should preserve:

- Cross-platform neutrality
- Visual boldness
- Architectural clarity
