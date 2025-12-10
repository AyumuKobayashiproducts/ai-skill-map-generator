"use client";

import { AdvancedInsights as AdvancedInsightsType } from "@/types/skillGenerator";
import { ChevronRight, BookOpen, Clock, Code, FileText } from "lucide-react";

interface AdvancedInsightsProps {
  data: AdvancedInsightsType;
}

export function AdvancedInsights({ data }: AdvancedInsightsProps) {
  return (
    <section className="section" id="advanced">
      <div className="container-default">
        <details className="accordion">
          <summary className="text-lg">
            <span className="flex items-center gap-2">
              <ChevronRight className="w-5 h-5 text-[var(--text-tertiary)]" />
              Advanced Insights
            </span>
          </summary>
          <div className="accordion-content space-y-8 pt-6">
            {/* Score Breakdown */}
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-4">
                <FileText className="w-4 h-4 text-[var(--accent-blue)]" />
                Score Breakdown
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(data.scoreBreakdown).map(([skill, info]) => (
                  <div key={skill} className="glass-card p-4">
                    <p className="text-sm text-[var(--text-secondary)] mb-1">
                      {skill}
                    </p>
                    <p className="text-2xl font-semibold text-[var(--text-primary)]">
                      {info.score}
                    </p>
                    <p className="text-xs text-[var(--text-tertiary)]">
                      {info.percentile}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Roadmap */}
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-4">
                <BookOpen className="w-4 h-4 text-[var(--accent-green)]" />
                Learning Roadmap
              </h3>
              <div className="space-y-3">
                {data.learningRoadmap.map((step, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 glass-card"
                  >
                    <div className="shrink-0 w-10 h-10 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center text-sm font-semibold text-[var(--text-secondary)]">
                      W{step.week}
                    </div>
                    <div>
                      <p className="font-medium text-[var(--text-primary)]">
                        {step.skill}
                      </p>
                      <p className="text-sm text-[var(--text-secondary)] mt-1">
                        {step.action}
                      </p>
                      {step.resource && (
                        <p className="text-xs text-[var(--accent-blue)] mt-2">
                          📚 {step.resource}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Estimated Hours */}
            <div className="glass-card p-6">
              <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-2">
                <Clock className="w-4 h-4 text-[var(--accent-yellow)]" />
                Estimated Learning Time
              </h3>
              <p className="text-4xl font-bold text-gradient">
                {data.estimatedHours} hours
              </p>
              <p className="text-sm text-[var(--text-secondary)] mt-2">
                to reach your next level across all skills
              </p>
            </div>

            {/* Practice Projects */}
            <div>
              <h3 className="flex items-center gap-2 text-base font-semibold text-[var(--text-primary)] mb-4">
                <Code className="w-4 h-4 text-[var(--accent-purple)]" />
                Suggested Practice Projects
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                {data.practiceProjects.map((project, index) => (
                  <div key={index} className="glass-card p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-[var(--text-primary)]">
                        {project.title}
                      </h4>
                      <span
                        className={`badge ${
                          project.difficulty === "beginner"
                            ? "badge-green"
                            : project.difficulty === "intermediate"
                            ? "badge-yellow"
                            : "badge-red"
                        }`}
                      >
                        {project.difficulty}
                      </span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      {project.description}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {project.skills.map((skill) => (
                        <span key={skill} className="badge badge-default">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Long-form Analysis */}
            <div className="glass-card p-6">
              <h3 className="text-base font-semibold text-[var(--text-primary)] mb-4">
                Detailed Analysis
              </h3>
              <div className="prose prose-invert prose-sm max-w-none">
                <p className="text-[var(--text-secondary)] whitespace-pre-wrap leading-relaxed">
                  {data.longFormAnalysis}
                </p>
              </div>
            </div>
          </div>
        </details>
      </div>
    </section>
  );
}

