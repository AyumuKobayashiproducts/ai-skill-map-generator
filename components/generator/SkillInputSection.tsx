"use client";

import { useState } from "react";
import { Plus, Sparkles, Loader2 } from "lucide-react";
import { SkillInput, SAMPLE_SKILLS } from "@/types/skillGenerator";
import { SkillRow } from "./SkillRow";

interface SkillInputSectionProps {
  onGenerate: (skills: SkillInput[]) => Promise<void>;
  isGenerating: boolean;
}

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function SkillInputSection({ onGenerate, isGenerating }: SkillInputSectionProps) {
  const [skills, setSkills] = useState<SkillInput[]>([
    { id: generateId(), name: "", yearsOfExperience: 1, level: 3 },
  ]);

  const handleAddSkill = () => {
    setSkills([
      ...skills,
      { id: generateId(), name: "", yearsOfExperience: 1, level: 3 },
    ]);
  };

  const handleRemoveSkill = (id: string) => {
    setSkills(skills.filter((s) => s.id !== id));
  };

  const handleUpdateSkill = (id: string, updated: SkillInput) => {
    setSkills(skills.map((s) => (s.id === id ? updated : s)));
  };

  const handleLoadSample = () => {
    setSkills(SAMPLE_SKILLS.map((s) => ({ ...s, id: generateId() })));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validSkills = skills.filter((s) => s.name.trim() !== "");
    if (validSkills.length === 0) return;
    await onGenerate(validSkills);
  };

  const validSkillCount = skills.filter((s) => s.name.trim() !== "").length;

  return (
    <section className="section" id="input">
      <div className="container-narrow">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                Your Skills
              </h2>
              <p className="text-sm text-[var(--text-secondary)] mt-1">
                Add your skills with experience and proficiency level
              </p>
            </div>
            <button
              type="button"
              onClick={handleLoadSample}
              className="btn btn-ghost btn-sm"
            >
              Load Sample
            </button>
          </div>

          {/* Skill List */}
          <div className="space-y-3">
            {/* Column Headers */}
            <div className="flex items-center gap-3 px-3 text-xs font-medium uppercase tracking-wider text-[var(--text-tertiary)]">
              <div className="flex-1">Skill Name</div>
              <div className="w-24 shrink-0 text-center">Experience</div>
              <div className="w-32 shrink-0 text-center">Level</div>
              <div className="w-8"></div>
            </div>

            {/* Skill Rows */}
            {skills.map((skill, index) => (
              <SkillRow
                key={skill.id}
                skill={skill}
                onChange={(updated) => handleUpdateSkill(skill.id, updated)}
                onRemove={() => handleRemoveSkill(skill.id)}
                canRemove={skills.length > 1}
              />
            ))}
          </div>

          {/* Add Skill Button */}
          <button
            type="button"
            onClick={handleAddSkill}
            className="w-full btn btn-secondary btn-md justify-center gap-2 border-dashed"
          >
            <Plus className="w-4 h-4" />
            Add Skill
          </button>

          {/* Generate Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={validSkillCount === 0 || isGenerating}
              className="w-full btn btn-primary btn-xl justify-center gap-3 font-semibold"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Analyzing Skills...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5" />
                  Generate Skill Map
                </>
              )}
            </button>
            {validSkillCount > 0 && !isGenerating && (
              <p className="text-center text-sm text-[var(--text-tertiary)] mt-3">
                {validSkillCount} skill{validSkillCount !== 1 ? "s" : ""} ready for analysis
              </p>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}

