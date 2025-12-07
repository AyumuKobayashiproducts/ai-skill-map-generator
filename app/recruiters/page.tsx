import Link from "next/link";

export default function RecruitersPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-3">
        <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
          For recruiters / hiring managers
        </p>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
          AI Skill Map Generator — Portfolio Project Summary
        </h1>
        <p className="text-sm md:text-base text-slate-600 leading-relaxed max-w-2xl">
          This is a full-stack portfolio project built to resemble a small real-world SaaS product:
          an AI-powered skill mapping and career coaching tool for early-career web engineers.
        </p>
      </header>

      <section className="grid gap-4 md:grid-cols-3">
        <div className="md:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span>🧩</span> What this project demonstrates
          </h2>
          <ul className="space-y-1.5 text-xs md:text-sm text-slate-700">
            <li>
              <span className="font-semibold">Product thinking:</span> designs a full flow from skill
              input → diagnosis → roadmap → job matching → interview practice → dashboard.
            </li>
            <li>
              <span className="font-semibold">Full-stack ownership:</span> Next.js App Router +
              TypeScript + Supabase + OpenAI, including auth, API routes, and DB schema.
            </li>
            <li>
              <span className="font-semibold">Quality & DX:</span> Zod validation, Vitest, Playwright
              E2E, CI via GitHub Actions, basic performance and accessibility considerations.
            </li>
            <li>
              <span className="font-semibold">Internationalization:</span> fully bilingual UI (Japanese
              / English) with locale-based routing, translated dashboards and metadata using
              <code className="px-1 py-0.5 mx-0.5 rounded bg-slate-100 text-[10px] align-middle">
                next-intl
              </code>
              .
            </li>
          </ul>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span>🛠️</span> Tech stack
          </h2>
          <ul className="space-y-1 text-xs md:text-sm text-slate-700">
            <li>Frontend: Next.js 15 (App Router), React, TypeScript, Tailwind CSS</li>
            <li>Backend: Next.js Route Handlers, OpenAI API (GPT-4.x family)</li>
            <li>Data & Auth: Supabase (Postgres + Auth, RLS)</li>
            <li>Testing: Vitest, Playwright</li>
            <li>Ops: GitHub Actions CI, basic PWA support</li>
          </ul>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span>👤</span> My role
          </h2>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            I handled everything end-to-end: product design, UI/UX, frontend, backend, database
            design, AI prompts, and basic testing/CI setup. The goal was to show how I would design
            and build a small but realistic product, not just a single feature or toy demo.
          </p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-sm font-semibold text-slate-900 mb-2 flex items-center gap-2">
            <span>🔍</span> Why it matters
          </h2>
          <p className="text-xs md:text-sm text-slate-700 leading-relaxed">
            Many AI projects stop at “call the API and show the result”. Here, the focus is on
            turning AI output into a coherent user journey: helping engineers understand their
            skills, plan learning, explore job fit, and practice interviews — with history and
            simple metrics to support real usage.
          </p>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <h2 className="text-sm font-semibold text-slate-900 mb-3 flex items-center gap-2">
          <span>🔗</span> Useful links
        </h2>
        <div className="flex flex-wrap gap-3 text-xs md:text-sm">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-colors"
          >
            <span>🌐</span>
            Open live app
          </Link>
          <a
            href="https://github.com/AyumuKobayashiproducts/ai-skill-map-generator"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-slate-800 font-semibold hover:bg-slate-50 transition-colors"
          >
            <span>📁</span>
            View source on GitHub
          </a>
          <Link
            href="/about"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold hover:bg-slate-100 transition-colors"
          >
            <span>ℹ️</span>
            Japanese detailed description
          </Link>
          <a
            href="/README.en.md"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 text-slate-800 font-semibold hover:bg-slate-100 transition-colors"
          >
            <span>📖</span>
            English README (more details)
          </a>
        </div>
      </section>
    </div>
  );
}


