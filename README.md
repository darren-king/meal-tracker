# Meal Tracker

A personal meal and food logging app built with Next.js. Log meals throughout the day, track food items and calories per meal, and review your intake by date.

> This project was built as a hands-on way to learn how [Claude Code](https://claude.ai/code) works — exploring its agentic capabilities, coding conventions, and how it reasons about and builds real software end-to-end.

## What it does

- **Log meals** — record a meal with a name and timestamp
- **Track food items** — add individual food items (with optional calories) to any meal
- **Daily view** — browse meals by date with a calendar date picker
- **Edit meals** — update meal details or manage food items after the fact
- **Auth** — sign in with Clerk; all data is scoped to your account
- **Dark/light theme** — toggleable via the header

## Stack

- [Next.js 16](https://nextjs.org) (App Router)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) (radix-nova style)
- [Drizzle ORM](https://orm.drizzle.team) with [Neon](https://neon.tech) (PostgreSQL)
- [Clerk](https://clerk.com) for authentication

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables (Clerk keys + Neon database URL):

```bash
cp .env.example .env.local
```

3. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Commands

```bash
npm run dev      # Start dev server at http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```
