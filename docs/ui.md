# UI Coding Standards

## Rule: shadcn/ui Only

All UI in this project **must** use shadcn/ui components. No custom UI components are permitted.

- Never build a custom button, input, dialog, dropdown, card, badge, etc. — use the shadcn/ui equivalent.
- Never reach for raw HTML elements (`<button>`, `<input>`, `<select>`) for interactive or styled UI — wrap them with the appropriate shadcn/ui component instead.
- Layout primitives (`<div>`, `<section>`, `<main>`, etc.) are fine as structural containers but must not carry custom interactive or decorative styling that belongs to a component.

## Configuration

| Setting | Value |
|---|---|
| Style | `radix-nova` |
| Base color | `neutral` |
| CSS variables | enabled |
| Icon library | `lucide-react` |
| Component path | `@/components/ui` |

## Installing Components

```bash
npx shadcn@latest add <component-name>
```

Components are installed into `src/components/ui/`. Do not edit generated files — if behaviour needs extending, compose with them.

## Component Usage

Import from the `@/components/ui` alias:

```tsx
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
```

## Icons

Use `lucide-react` exclusively — it is the configured icon library for shadcn/ui in this project.

```tsx
import { Plus, Trash2, ChevronDown } from "lucide-react"
```

## Styling

- Use Tailwind utility classes for spacing, layout, and typography.
- Use CSS variables exposed by shadcn/ui (`bg-background`, `text-foreground`, `border`, `ring`, etc.) for colour — never hardcode hex values.
- Variants and sizes are controlled through the component's own props (e.g. `<Button variant="outline" size="sm">`), not by overriding classes.

## What Is Not Allowed

- Custom React components that replicate shadcn/ui functionality (e.g. a hand-rolled `<Modal>` when `<Dialog>` exists).
- Inline `style` props for anything a Tailwind class or shadcn/ui prop already covers.
- Third-party component libraries (Material UI, Chakra, Ant Design, etc.).
- CSS Modules or styled-components — Tailwind + CSS variables only.
