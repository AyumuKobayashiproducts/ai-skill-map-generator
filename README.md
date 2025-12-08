<h1 align="center">
  <img src="./public/icon.svg" alt="AI Skill Map Generator" width="80" height="80" />
  <br />
  AI Skill Map Generator
</h1>

<p align="center">
  <strong>🎯 Career diagnosis for web engineers — skills, roadmaps, job matching and interview prep in 60 seconds</strong>
</p>

<p align="center">
  <a href="https://ai-skill-map-generator.vercel.app">
    <img src="https://img.shields.io/badge/▶%20Live%20Demo-00C7B7?style=for-the-badge&logo=vercel&logoColor=white" alt="Live Demo" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/AyumuKobayashiproducts/ai-skill-map-generator/actions/workflows/ci.yml">
    <img src="https://github.com/AyumuKobayashiproducts/ai-skill-map-generator/actions/workflows/ci.yml/badge.svg" alt="CI Status" />
  </a>
  <img src="https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js" alt="Next.js 14" />
  <img src="https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white" alt="TypeScript 5.6" />
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black" alt="React 18" />
  <img src="https://img.shields.io/badge/Supabase-3FCF8E?style=flat-square&logo=supabase&logoColor=white" alt="Supabase" />
  <img src="https://img.shields.io/badge/OpenAI-412991?style=flat-square&logo=openai&logoColor=white" alt="OpenAI" />
  <img src="https://img.shields.io/badge/i18n-🌐%20EN%20|%20JP-blue?style=flat-square" alt="Bilingual" />
  <img src="https://img.shields.io/badge/License-MIT-yellow?style=flat-square" alt="MIT License" />
</p>

<p align="center">
  <a href="./README.ja.md">🇯🇵 日本語版 README</a>
  &nbsp;·&nbsp;
  <a href="#-live-demo">Live Demo</a>
  &nbsp;·&nbsp;
  <a href="#-features">Features</a>
  &nbsp;·&nbsp;
  <a href="#-tech-stack">Tech Stack</a>
  &nbsp;·&nbsp;
  <a href="#-quick-start">Quick Start</a>
</p>

---

<p align="center">
  <img src="./public/screenshots/home.png" alt="AI Skill Map Generator – Home (EN UI)" width="800" />
</p>

---

## 💡 What This Project Says About Me

> **I don't just write code — I design, ship, and polish small products end-to-end.**

| Signal | Evidence in This Repo |
|--------|----------------------|
| **Product Thinking** | Designed a complete career diagnosis flow (skills → roadmap → job match → interview prep) with clear user stories |
| **Full-Stack Ownership** | Next.js 14 App Router + TypeScript + Supabase + OpenAI API — all architected and implemented solo |
| **AI Integration** | Prompt engineering for GPT-4o-mini across 10+ API endpoints with error handling and i18n |
| **Quality & Testing** | Vitest unit tests + Playwright E2E + GitHub Actions CI pipeline |
| **Internationalization** | Fully bilingual (EN/JP) with `next-intl`, locale-aware routing, and API error messages |
| **UX & Polish** | Mobile-first design, PWA support, skip links, keyboard navigation, thoughtful micro-copy |

---

## 🎬 Live Demo

**👉 [ai-skill-map-generator.vercel.app](https://ai-skill-map-generator.vercel.app)**

Try the full flow in under 60 seconds:
1. Choose a career goal (e.g., "Frontend specialist")
2. Paste your skills or click **"Insert sample text"**
3. Explore the result: skill radar, roadmap, job matching, 1-on-1 practice

---

## ✨ Features

<table>
  <tr>
    <td align="center" width="33%">
      <img src="./public/screenshots/home.png" alt="Home (EN UI)" width="280" />
      <br /><strong>🎯 3-Step Diagnosis</strong>
      <br /><small>Paste your experience → get a skill map</small>
    </td>
    <td align="center" width="33%">
      <img src="./public/screenshots/dashboard.png" alt="Dashboard (EN UI)" width="280" />
      <br /><strong>📊 Progress dashboard</strong>
      <br /><small>See how your scores evolve over time</small>
    </td>
    <td align="center" width="33%">
      <img src="./public/screenshots/about.png" alt="About this app (EN UI)" width="280" />
      <br /><strong>ℹ️ Product & tech overview</strong>
      <br /><small>Show how the system is designed</small>
    </td>
  </tr>
</table>

### Core Capabilities

| Feature | What It Does | Why It Matters |
|---------|--------------|----------------|
| 🗺️ **Skill Map** | Visualize 5 skill categories in a radar chart | See your strengths and gaps at a glance |
| 📈 **Learning Roadmap** | AI-generated 30-day and 90-day plans | Know exactly what to learn next |
| 💼 **Job Matching** | Compare your skills against job posts | Find roles that fit — or see what's missing |
| ⚠️ **Career Risk Analysis** | Quantify obsolescence / automation risk | Make informed long-term decisions |
| 🎤 **1-on-1 Interview Practice** | AI-powered mock interviews with feedback | Prepare stories, not just bullet points |
| 📋 **Portfolio Generator** | Turn projects into markdown summaries | Ship your portfolio faster |
| ⏰ **Time Simulator** | Adjust roadmaps based on available hours | Realistic plans you'll actually follow |

---

## 🛠 Tech Stack

```
┌─────────────────────────────────────────────────────────────────────┐
│  FRONTEND                                                           │
│  ├─ Next.js 14 (App Router, Server Components)                      │
│  ├─ React 18                                                        │
│  ├─ TypeScript 5.6 (strict mode)                                    │
│  ├─ Tailwind CSS (custom design tokens)                             │
│  ├─ Chart.js + react-chartjs-2 (radar charts)                       │
│  └─ next-intl (i18n with locale-aware routing)                      │
├─────────────────────────────────────────────────────────────────────┤
│  BACKEND                                                            │
│  ├─ Next.js Route Handlers (API routes)                             │
│  ├─ OpenAI SDK (GPT-4o-mini)                                        │
│  └─ Zod (request/response schema validation)                        │
├─────────────────────────────────────────────────────────────────────┤
│  DATABASE & AUTH                                                    │
│  ├─ Supabase (PostgreSQL)                                           │
│  ├─ Supabase Auth (Email + Google Sign-In)                          │
│  └─ Row Level Security (RLS) for data isolation                     │
├─────────────────────────────────────────────────────────────────────┤
│  QUALITY & DEVOPS                                                   │
│  ├─ Vitest (unit tests)                                             │
│  ├─ Playwright (E2E tests)                                          │
│  ├─ ESLint + Prettier (code style)                                  │
│  └─ GitHub Actions (CI/CD pipeline)                                 │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🏛 Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              CLIENT                                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌─────────────┐  │
│  │    Home      │  │  Dashboard   │  │    Result    │  │  Portfolio  │  │
│  │  (Diagnosis) │  │  (History)   │  │   (Tabs)     │  │  (Export)   │  │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  └──────┬──────┘  │
└─────────┼─────────────────┼─────────────────┼─────────────────┼─────────┘
          │                 │                 │                 │
          ▼                 ▼                 ▼                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                          API ROUTES (Next.js)                            │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐       │
│  │/generate │ │/job-match│ │/oneonone │ │  /risk   │ │/readiness│       │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘       │
└───────┼────────────┼────────────┼────────────┼────────────┼─────────────┘
        │            │            │            │            │
        ▼            ▼            ▼            ▼            ▼
┌────────────────────┐    ┌──────────────────────────────────────────────┐
│     Supabase       │    │                  OpenAI API                   │
│  ┌──────────────┐  │    │  ┌──────────────────────────────────────────┐│
│  │  PostgreSQL  │  │    │  │  GPT-4o-mini                             ││
│  │  (RLS)       │  │    │  │  • Skill analysis & classification       ││
│  ├──────────────┤  │    │  │  • Roadmap generation                    ││
│  │  Auth        │  │    │  │  • Job matching & gap analysis           ││
│  │  (Email +    │  │    │  │  • Interview Q&A and feedback            ││
│  │   Google)    │  │    │  └──────────────────────────────────────────┘│
│  └──────────────┘  │    └──────────────────────────────────────────────┘
└────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm / yarn / pnpm
- OpenAI API key
- Supabase project (free tier works)

### Installation

```bash
# Clone
git clone https://github.com/AyumuKobayashiproducts/ai-skill-map-generator.git
cd ai-skill-map-generator

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
# Edit .env.local with your API keys:
#   OPENAI_API_KEY=sk-...
#   NEXT_PUBLIC_SUPABASE_URL=https://...
#   NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Available Scripts

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript checks
npm run test         # Run unit tests (Vitest)
npm run test:e2e     # Run E2E tests (Playwright)
npm run screenshot   # Capture screenshots for docs
```

---

## 📁 Project Structure

```
ai-skill-map-generator/
├── app/                        # Next.js App Router
│   ├── [locale]/              # i18n locale-based routing
│   ├── api/                   # API endpoints
│   │   ├── generate/          # Skill map generation
│   │   ├── job-match/         # Job matching
│   │   ├── oneonone/          # Interview practice
│   │   ├── risk/              # Career risk analysis
│   │   ├── readiness/         # Readiness score
│   │   └── ...
│   ├── dashboard/             # History & trends
│   ├── result/[id]/           # Result page (tabs)
│   └── ...
├── components/                # React components
│   ├── ui/                    # Design system primitives
│   ├── SkillChart.tsx         # Radar chart
│   ├── JobMatchSection.tsx    # Job matching UI
│   └── ...
├── lib/                       # Utilities & business logic
│   ├── answerEvaluator.ts     # Rule-based scoring
│   ├── readiness.ts           # Readiness calculation
│   ├── apiClient.ts           # Type-safe API client
│   └── ...
├── src/
│   ├── i18n/                  # i18n configuration
│   └── messages/              # Translation files (en.json, ja.json)
├── types/                     # TypeScript types & Zod schemas
├── tests/                     # Test files
│   ├── e2e/                   # Playwright E2E tests
│   └── unit/                  # Vitest unit tests
├── docs/                      # Extended documentation
│   ├── architecture.md
│   ├── testing.md
│   ├── accessibility.md
│   ├── performance.md
│   ├── case-studies.md
│   └── ...
└── public/                    # Static assets & PWA manifest
```

---

## 🎯 Hiring Manager? Start Here

### What I'd Bring to Your Team

| Capability | How This Project Demonstrates It |
|------------|----------------------------------|
| **Ship fast, iterate faster** | Designed and built this entire product solo, from idea to deployed app |
| **AI-native thinking** | Prompt design, error handling, cost/latency trade-offs across 10+ OpenAI integrations |
| **Type-first, test-pragmatic** | Zod schemas for API contracts, Vitest for logic, Playwright for critical paths |
| **User empathy** | i18n, error states, loading feedback, keyboard nav — the details users actually notice |

### Key Documentation

| Document | What You'll Find |
|----------|------------------|
| [docs/testing.md](docs/testing.md) | Testing strategy, coverage philosophy, CI integration |
| [docs/architecture.md](docs/architecture.md) | System design, data flow, prompt engineering approach |
| [docs/accessibility.md](docs/accessibility.md) | A11y considerations and keyboard navigation |
| [docs/performance.md](docs/performance.md) | Performance optimizations and perceived latency tricks |
| [docs/case-studies.md](docs/case-studies.md) | User personas and before/after narratives |
| [docs/i18n.md](docs/i18n.md) | Internationalization strategy and implementation |

---

## 📊 Career Readiness Score Formula

The "Job Readiness Score" is a composite metric designed to give users an actionable summary:

```
Total Score = Skill Score + Job Match Score + Risk Score + Prep Score
            = (0–40)      + (0–30)          + (0–20)     + (0–10)
            = 0–100 points
```

| Score Range | Level | Interpretation |
|-------------|-------|----------------|
| 75–100 | 🟢 **High** | Ready to start applying now |
| 45–74 | 🟡 **Medium** | Can apply while still preparing |
| 0–44 | 🔴 **Low** | Focus on foundation-building first |

---

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

---

## 📜 License

MIT License — see [LICENSE](./LICENSE) for details.

---

<p align="center">
  <strong>If you've read this far, thank you!</strong>
  <br />
  Built with ❤️ as a portfolio project by <a href="https://github.com/AyumuKobayashiproducts">AyumuKobayashiproducts</a>
  <br /><br />
  ⭐ If you find this useful, a star would mean a lot!
</p>
