"use client";

import { useState } from "react";
import {
  Header,
  Footer,
  HeroSection,
  SkillInputSection,
  OutputSection,
  AdvancedInsights,
} from "@/components/generator";
import { SkillInput, SkillMapOutput } from "@/types/skillGenerator";

export default function GeneratorPage() {
  const [result, setResult] = useState<SkillMapOutput | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (skills: SkillInput[]) => {
    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch("/api/skill-analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ skills }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || "Analysis failed");
      }

      setResult(data.data);

      // Scroll to output
      setTimeout(() => {
        document.getElementById("output")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <Header />

      <main>
        {/* Hero */}
        <HeroSection />

        {/* Input */}
        <SkillInputSection
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        {/* Error */}
        {error && (
          <div className="container-narrow py-4">
            <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          </div>
        )}

        {/* Output */}
        {result && (
          <>
            <div className="divider container-default" />
            <OutputSection result={result} />

            {/* Advanced Insights */}
            {result.advanced && (
              <>
                <div className="divider container-default" />
                <AdvancedInsights data={result.advanced} />
              </>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

