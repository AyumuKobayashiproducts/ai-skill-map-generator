## AI Skill Map Generator

[![Build Status](https://github.com/AyumuKobayashiproducts/ai-skill-map-generator/actions/workflows/ci.yml/badge.svg)](https://github.com/AyumuKobayashiproducts/ai-skill-map-generator/actions/workflows/ci.yml)
[![Test](https://img.shields.io/badge/test-vitest%20%2B%20playwright-6E9F18)](https://vitest.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-000000?logo=next.js&logoColor=white)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Postgres-3FCF8E?logo=supabase&logoColor=white)](https://supabase.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> 🎯 An AI-powered skill mapping and career coaching tool for early-career web engineers

Enter your skills and work experience (in Japanese) and get **skill radar charts, learning roadmaps, job matching, interview practice, and portfolio summaries** — all in one place.

- 🌐 **Live demo**: <https://ai-skill-map-generator.vercel.app>
- 📱 **PWA**: installable on Android / iOS home screen (Add to Home Screen)
- 🔐 **Auth**: email & password + Google Sign-In (Supabase Auth)
- 🌏 **i18n**: fully bilingual UI (Japanese / English) with locale-aware routing and metadata
- 📖 **Japanese README**: [README.md](./README.md)

---

### Features

| Feature | Description |
|---------|-------------|
| 🗺️ **Skill Map** | Radar chart visualization across 5 categories (Frontend, Backend, Infra, AI, Tools) |
| 📈 **Learning Roadmap** | 30-day and 90-day personalized learning plans |
| 💼 **Job Matching** | Match score calculation with job postings + skill gap analysis |
| ⚠️ **Career Risk Radar** | Visualize obsolescence / over-specialization / automation risks |
| 🎤 **Interview Practice** | AI-powered mock interviews with 3 types (General, Technical, Behavioral) |
| 📋 **Portfolio Generator** | Auto-generate portfolio summaries in Markdown/JSON format |

---

### Who is this for?

- **Early-career web engineers** preparing for their **first or next job change**
- Engineers who want a **clear picture of their skills and gaps**, not just a long CV
- Mentors / career coaches who need a simple tool to **visualize mentees’ growth**

---

### Tech Stack

```
Frontend:   Next.js 15 (App Router) + React 19 + TypeScript
Backend:    Next.js API Routes + OpenAI API
Database:   Supabase (PostgreSQL)
Validation: Zod
Testing:    Vitest (unit) + Playwright (E2E)
I18n:       next-intl (App Router, locale-based routing)
Styling:    Tailwind CSS
CI/CD:      GitHub Actions
```

---

### Production-readiness (What this project demonstrates)

This project is intentionally built to look and feel like a **small real-world product**, not just a toy demo:

- **Authentication & Data Safety**
  - Supabase Auth with email/password + Google Sign-In
  - User-specific skill maps and interview sessions stored in Supabase with RLS (Row Level Security)
  - Clear separation between public demo behavior and logged-in user data

- **Testing & CI Pipeline**
  - Vitest unit tests for core logic (readiness scoring, answer evaluation, etc.)
  - Playwright E2E tests for the main flow (Home → Diagnose → Result)
  - GitHub Actions CI running both unit + E2E tests on pull requests
  - Test coverage and Playwright artifacts (screenshots / traces) uploaded as CI artifacts

- **Usage Logging & Simple Metrics**
  - Usage logs stored in the database for key events (diagnosis, interview practice, etc.)
  - `/admin/usage` dashboard to inspect:
    - Recent events list
    - Event names by feature (diagnosis, job match, 1on1 practice, etc.)
  - Designed as a starting point for data-driven product improvement

- **PWA & Mobile Experience**
  - Installable as a PWA on Android / iOS (Add to Home Screen)
  - Basic offline-friendly behavior via `manifest.json` and a simple `sw.js`
  - Mobile-first layout and touch-friendly controls

If you are evaluating this repository as a hiring manager, please see also:

- `docs/testing.md` — testing strategy and CI integration  
- `docs/accessibility.md` — accessibility considerations  
- `docs/performance.md` — performance tuning notes  
- `docs/case-studies.md` — example user stories and before/after narratives
 - `docs/findy-summary.en.md` — 1-page English summary of this project for hiring managers

---

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐          │
│  │   Home      │  │  Dashboard  │  │   Result    │          │
│  │  (Input)    │  │  (History)  │  │  (Tabs)     │          │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘          │
└─────────┼────────────────┼────────────────┼─────────────────┘
          │                │                │
          ▼                ▼                ▼
┌─────────────────────────────────────────────────────────────┐
│                    API Routes (Next.js)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐        │
│  │/generate │ │/job-match│ │/oneonone │ │/risk     │        │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘        │
└───────┼────────────┼────────────┼────────────┼──────────────┘
        │            │            │            │
        ▼            ▼            ▼            ▼
┌───────────────┐  ┌───────────────────────────────────────────┐
│   Supabase    │  │              OpenAI API                   │
│  (PostgreSQL) │  │  (GPT-4.1-mini for analysis/feedback)     │
└───────────────┘  └───────────────────────────────────────────┘
```

---

### Quick Start

```bash
# Clone the repository
git clone https://github.com/AyumuKobayashiproducts/ai-skill-map-generator.git
cd ai-skill-map-generator

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Then edit .env.local and set your Supabase + OpenAI API keys

# (Optional) Set up Supabase locally
# See docs/infra.md for schema and RLS configuration

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

### Interview Practice Feature (Highlight)

One of the standout features is the **AI-powered Interview Practice Mode**:

- **3 Interview Types**: General, Technical, Behavioral (STAR method)
- **Personalized Questions**: Generated based on your skill map analysis
- **Real-time Scoring**: Rule-based evaluation of answer quality (length, specificity, structure, STAR elements)
- **AI Feedback**: Detailed feedback with improved answer examples
- **Session Summary**: Overall score, strengths, areas for improvement, and next steps
- **Progress Tracking**: Session history with score comparison over time

---

### Testing

```bash
# Unit tests
npm run test

# E2E tests (requires running dev server)
npm run test:e2e

# Generate screenshots
npm run screenshot
```

---

### Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   │   ├── generate/      # Skill map generation
│   │   ├── job-match/     # Job matching
│   │   ├── oneonone/      # Interview practice APIs
│   │   └── ...
│   ├── result/[id]/       # Result page with tabs
│   └── dashboard/         # History dashboard
├── components/            # React components
├── lib/                   # Utility functions
│   ├── answerEvaluator.ts # Rule-based answer scoring
│   ├── readiness.ts       # Career readiness scoring
│   └── ...
├── types/                 # TypeScript types & Zod schemas
├── tests/e2e/            # Playwright E2E tests
└── docs/                  # Documentation
```

---

### Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

### License

MIT License - see [LICENSE](./LICENSE) for details.

---

### Author

Built as a portfolio project to demonstrate full-stack development skills with AI integration.

If you find this useful, please consider giving it a ⭐!




