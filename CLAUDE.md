# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## IMPORTANT: Docs First

Before generating any code, always read the relevant file(s) in the `/docs` directory first. The `/docs` directory is the source of truth for coding standards and conventions in this project. Do not write code that conflicts with those standards.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

No test runner is configured yet.

## UI Standards

**All UI must use shadcn/ui components. No custom UI components.** See `docs/ui.md` for full standards.

## Authentication Standards

**This app uses Clerk for authentication. No other auth library is permitted.** See `docs/auth.md` for full standards.

## Data Fetching Standards

**Data fetching must use Server Components only. No route handlers for data. All queries via Drizzle ORM in `src/data/`. Users may only access their own data.** See `docs/data-fetching.md` for full standards.

## Data Mutation Standards

**Mutations must use Server Actions in co-located `actions.ts` files. All parameters must have explicit TypeScript types (no `FormData`). All inputs must be validated with Zod. Database calls must go through `src/data/` helpers.** See `docs/data-mutations.md` for full standards.

Install components: `npx shadcn@latest add <component-name>` → outputs to `src/components/ui/`

## Stack

- **Next.js 16** with the App Router (`src/app/`)
- **React 19**
- **TypeScript**
- **Tailwind CSS v4** (configured via PostCSS)
- **shadcn/ui** (style: `radix-nova`, icons: `lucide-react`)
- Fonts: Geist Sans and Geist Mono via `next/font/google`

## Architecture

This is a fresh Next.js App Router project. All routes live under `src/app/`. The root layout (`src/app/layout.tsx`) sets up fonts and a full-height flex column body. No data layer, state management, or API routes exist yet — this is a blank canvas for the meal tracker feature work.
