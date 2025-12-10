"use client";

import { Sparkles } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-radial pointer-events-none" />
      <div className="absolute inset-0 bg-grid pointer-events-none opacity-50" />
      
      {/* Content */}
      <div className="relative container-narrow py-20 md:py-32 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--bg-secondary)] border border-[var(--border-primary)] mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-[var(--accent-blue)]" />
          <span className="text-sm text-[var(--text-secondary)]">
            AI-Powered Skill Analysis
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6 animate-fade-in-up">
          <span className="text-[var(--text-primary)]">AI Skill</span>{" "}
          <span className="text-gradient">Generator</span>
        </h1>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-[var(--text-secondary)] max-w-2xl mx-auto leading-relaxed animate-fade-in-up delay-100">
          Understand your skills and get actionable AI-powered insights.
          <br className="hidden md:block" />
          Transform your career with data-driven recommendations.
        </p>

        {/* Scroll indicator */}
        <div className="mt-16 animate-fade-in delay-300">
          <a
            href="#input"
            className="inline-flex flex-col items-center gap-2 text-[var(--text-tertiary)] hover:text-[var(--text-secondary)] transition-colors"
          >
            <span className="text-xs uppercase tracking-wider">Get Started</span>
            <svg
              className="w-5 h-5 animate-bounce"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

