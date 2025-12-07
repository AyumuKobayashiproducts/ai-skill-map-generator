"use client";

import type { ReactNode } from "react";

interface DemoGuideBannerProps {
  step: number;
  title: string;
  description: ReactNode;
}

export function DemoGuideBanner({ step, title, description }: DemoGuideBannerProps) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-8 z-40 flex justify-center px-4 sm:px-6">
      <div className="pointer-events-auto max-w-5xl w-full rounded-md bg-black/90 text-white px-6 sm:px-10 py-4 sm:py-5 text-[18px] sm:text-[22px] leading-relaxed shadow-[0_0_40px_rgba(0,0,0,0.8)]">
        <div className="font-semibold mb-1">
          {step}. {title}
        </div>
        <div className="text-slate-100">
          {description}
        </div>
      </div>
    </div>
  );
}


