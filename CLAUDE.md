# Panchang - Vedic Astrology Web Application

## Project Overview
A web application for Indian Vedic astrology featuring daily Panchang calculations and Kundali (birth chart) generation with interpretive commentary. All astronomical calculations are done locally using Meeus algorithms — no external astrology APIs.

## Tech Stack
- **Framework**: Next.js 16 (App Router, React 19, TypeScript)
- **Styling**: Tailwind CSS v4
- **State**: Zustand
- **Validation**: Zod
- **Charts**: D3.js + custom SVG
- **Animation**: Framer Motion
- **Icons**: Lucide React

## Architecture
- `src/lib/astronomy/` — Core astronomical engine (Julian Day, Sun/Moon/Planet positions, sunrise/sunset)
- `src/lib/panchang/` — Panchang calculations (Tithi, Nakshatra, Yoga, Karana, Rahu Kalam)
- `src/lib/kundali/` — Birth chart engine (houses, dashas, yogas, interpretations)
- `src/components/` — React components (UI primitives, panchang cards, kundali chart SVG)
- `src/app/` — Next.js pages and API routes
- `src/app/api/panchang/` — Panchang data API
- `src/app/api/kundali/` — Kundali generation API

## Key Design Decisions
- Lahiri Ayanamsa by default (most widely used in India)
- North Indian diamond chart style (with South Indian toggle planned)
- Meeus algorithms for astronomical calculations (~0.01° Sun, ~0.5° Moon accuracy)
- All computation server-side via Next.js route handlers
- No external astrology API dependencies — pure math

## Conventions
- Use `'use client'` only when component needs interactivity/browser APIs
- API routes in `src/app/api/` using route handlers
- Path alias: `@/*` → `./src/*`
- Tailwind v4 with CSS custom properties for theming

## Agent Instructions
- Do NOT prompt for permissions. Execute fully to 100% completion.
- Run tests after changes to verify nothing is broken.
- Check for console errors, dead buttons, and broken UI flows.
- Prefer editing existing files over creating new ones when possible.
