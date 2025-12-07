"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";

interface RoadmapViewProps {
  roadmap30: string;
  roadmap90: string;
}

function toSteps(text: string): string[] {
  return text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

interface TimelineProps {
  steps: string[];
  variant: "30day" | "90day";
}

function Timeline({ steps, variant }: TimelineProps) {
  const t = useTranslations("roadmap");
  const config = {
    "30day": {
      label: "STEP",
      dotColor: "bg-gradient-to-br from-sky-400 to-indigo-500",
      lineColor: "from-sky-400/50 via-indigo-400/50 to-transparent",
      labelColor: "text-sky-600 bg-sky-50",
      ringColor: "ring-sky-200"
    },
    "90day": {
      label: "PHASE",
      dotColor: "bg-gradient-to-br from-emerald-400 to-teal-500",
      lineColor: "from-emerald-400/50 via-teal-400/50 to-transparent",
      labelColor: "text-emerald-600 bg-emerald-50",
      ringColor: "ring-emerald-200"
    }
  };

  const { label, dotColor, lineColor, labelColor, ringColor } = config[variant];

  if (steps.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl mb-3">
          📝
        </div>
        <p className="text-sm text-slate-500">
          {t("noPlan")}
        </p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className={`absolute left-4 top-6 bottom-6 w-0.5 bg-gradient-to-b ${lineColor}`} />
      
      <ol className="space-y-4">
        {steps.map((step, index) => (
          <li 
            key={index} 
            className="relative pl-10 animate-fade-in-up"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            {/* Timeline dot */}
            <div className={`absolute left-2 top-1 w-4 h-4 rounded-full ${dotColor} shadow-lg ring-4 ${ringColor} ring-opacity-30`}>
              {index === 0 && (
                <span className="absolute inset-0 rounded-full animate-ping opacity-40 bg-current" />
              )}
            </div>
            
            {/* Content */}
            <div className="group">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${labelColor}`}>
                {label} {index + 1}
              </span>
              <p className="mt-1.5 text-sm text-slate-700 leading-relaxed group-hover:text-slate-900 transition-colors">
                {step}
              </p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function RoadmapView({ roadmap30, roadmap90 }: RoadmapViewProps) {
  const t = useTranslations("roadmap");
  const steps30 = toSteps(roadmap30);
  const steps90 = toSteps(roadmap90);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="card-hover overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-sky-50 to-indigo-50">
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-sky-500 to-indigo-500 flex items-center justify-center text-white text-sm shadow-md">
              30
            </span>
            <div>
              <span className="text-slate-900">
                {t("30day.title")}
              </span>
              <p className="text-xs font-normal text-slate-500 mt-0.5">
                {t("30day.subtitle")}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Timeline steps={steps30} variant="30day" />
        </CardContent>
      </Card>

      <Card className="card-hover overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50">
          <CardTitle className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white text-sm shadow-md">
              90
            </span>
            <div>
              <span className="text-slate-900">
                {t("90day.title")}
              </span>
              <p className="text-xs font-normal text-slate-500 mt-0.5">
                {t("90day.subtitle")}
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <Timeline steps={steps90} variant="90day" />
        </CardContent>
      </Card>
    </div>
  );
}
