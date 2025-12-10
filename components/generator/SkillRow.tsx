"use client";

import { SkillInput, SKILL_LEVELS } from "@/types/skillGenerator";
import { Trash2 } from "lucide-react";

interface SkillRowProps {
  skill: SkillInput;
  onChange: (skill: SkillInput) => void;
  onRemove: () => void;
  canRemove: boolean;
}

export function SkillRow({ skill, onChange, onRemove, canRemove }: SkillRowProps) {
  return (
    <div className="skill-row group animate-fade-in-up">
      {/* Skill Name */}
      <div className="flex-1 min-w-0">
        <input
          type="text"
          value={skill.name}
          onChange={(e) => onChange({ ...skill, name: e.target.value })}
          placeholder="Skill name (e.g., React)"
          className="input"
        />
      </div>

      {/* Years of Experience */}
      <div className="w-24 shrink-0">
        <select
          value={skill.yearsOfExperience}
          onChange={(e) => onChange({ ...skill, yearsOfExperience: Number(e.target.value) })}
          className="select"
        >
          {[...Array(11)].map((_, i) => (
            <option key={i} value={i}>
              {i === 0 ? "<1 yr" : i === 10 ? "10+ yrs" : `${i} ${i === 1 ? "yr" : "yrs"}`}
            </option>
          ))}
        </select>
      </div>

      {/* Level */}
      <div className="w-32 shrink-0">
        <select
          value={skill.level}
          onChange={(e) => onChange({ ...skill, level: Number(e.target.value) as 1 | 2 | 3 | 4 | 5 })}
          className="select"
        >
          {([1, 2, 3, 4, 5] as const).map((level) => (
            <option key={level} value={level}>
              {SKILL_LEVELS[level].label}
            </option>
          ))}
        </select>
      </div>

      {/* Remove Button */}
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        className="btn btn-ghost btn-sm opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-0"
        aria-label="Remove skill"
      >
        <Trash2 className="w-4 h-4 text-[var(--text-tertiary)]" />
      </button>
    </div>
  );
}

