"use client";

import { SummaryCard } from "./SummaryCard";
import { SummaryItem } from "@/types/skillGenerator";

interface SummaryGridProps {
  strengths: SummaryItem[];
  weaknesses: SummaryItem[];
  nextFocus: SummaryItem[];
}

export function SummaryGrid({ strengths, weaknesses, nextFocus }: SummaryGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="delay-100">
        <SummaryCard type="strengths" items={strengths} />
      </div>
      <div className="delay-200">
        <SummaryCard type="weaknesses" items={weaknesses} />
      </div>
      <div className="delay-300">
        <SummaryCard type="nextFocus" items={nextFocus} />
      </div>
    </div>
  );
}

