## AI Skill Map Generator — Project Summary (for Hiring Managers)

### 1. Project Overview

**AI Skill Map Generator** is a web application that helps early-career web engineers (roughly 1–3 years of experience) prepare for job changes.  
By pasting their work history in Japanese, users can get:

- A radar chart skill map across 5 categories (Frontend / Backend / Infra / AI / Tools)
- 30-day and 90-day learning roadmaps
- Job matching with real job descriptions (match score + missing skills)
- Career risk analysis (obsolescence / bus factor / automation risk)
- AI-powered interview practice with 1on1 session history and score trends
- Portfolio summaries in Markdown format for GitHub / job platforms

The app is deployed on Vercel with Supabase (Postgres + Auth) and OpenAI as backends, and is installable as a PWA on mobile.

---

### 2. My Role

This is a solo project — I designed and implemented everything end-to-end:

- **Product design**: user stories, feature set, and UX flow (diagnose → roadmap → job match → interview practice)
- **Frontend**: Next.js (App Router) + React + TypeScript, responsive UI with Tailwind CSS
- **Backend / API**: Next.js Route Handlers, integration with Supabase and OpenAI
- **Data design**: Supabase schema for skill maps, usage logs, and 1on1 sessions with RLS in mind
- **Testing & CI**: Vitest (unit), Playwright (E2E), GitHub Actions workflows

---

### 3. Tech Stack (High-level)

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Chart.js
- **Backend**: Next.js API Routes, OpenAI API (`gpt-4o-mini`), Zod for validation
- **Data / Auth**: Supabase (PostgreSQL), Supabase Auth with email/password + Google Sign-In, Row Level Security
- **Quality & Ops**: Vitest, Playwright, ESLint, Prettier, GitHub Actions CI, usage logs + `/admin/usage` dashboard
- **UX / Platform**: PWA support (installable on Android / iOS), mobile-friendly design

More details are documented in `docs/architecture.md`, `docs/design-notes.md`, `docs/testing.md`,
`docs/accessibility.md`, `docs/performance.md`, `docs/case-studies.md`, and `docs/monetization.md`.

---

### 4. What I Tried to Demonstrate

1. **Product thinking for “AI × career”**
   - Instead of building a one-off “AI diagnosis tool”, I designed a flow that matches real job-change workflows:
     **skill inventory → learning plan → job matching → interview practice → dashboard**.
   - I introduced concepts like a “career readiness score” and “career risk radar” to support concrete decisions.

2. **Type-safe full-stack implementation**
   - Core scoring and mapping logic is implemented as pure functions under `lib/` with shared types in `types/`.
   - API handlers use Zod for input validation and return structured responses, which are covered by unit tests.

3. **Production-like operation setup**
   - CI pipeline (type-check, test, build) via GitHub Actions, with Vitest coverage and Playwright artifacts.
   - Usage logs and an `/admin/usage` dashboard to understand which features are used and where users drop off.
   - PWA and mobile UX so that users can “install” the app during their job-hunting period.

4. **Monetization and plan design (conceptual)**
   - I documented potential Free / Pro / Team plans in `docs/monetization.md`, and surfaced a simplified pricing view on the About page.
   - The current implementation does not include real payments but is structured to later plug in Stripe / Paddle and a `plan` field in user profiles.

---

### 5. Why this project matters for my career

- It shows that I can **design and implement a small SaaS-like product on my own**, not just isolated features.
- It combines:
  - AI integration (OpenAI)
  - full-stack web development (Next.js + Supabase)
  - testing and CI
  - basic product analytics (usage logs and simple funnel)
  - and even early thoughts on monetization and pricing.
- In interviews, I can walk through:
  - the user journey,
  - key design decisions (data model, RLS, API boundaries),
  - testing and deployment setup,
  - and how I would iterate on the product if it were actually launched.







