import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

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

export function RoadmapView({ roadmap30, roadmap90 }: RoadmapViewProps) {
  const steps30 = toSteps(roadmap30);
  const steps90 = toSteps(roadmap90);

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>30日ロードマップ</CardTitle>
        </CardHeader>
        <CardContent>
          {steps30.length > 0 ? (
            <ol className="relative border-l border-muted pl-4 space-y-3 text-sm">
              {steps30.map((step, index) => (
                <li key={index} className="ml-1">
                  <div className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-primary" />
                  <div className="ml-3">
                    <span className="text-xs font-semibold text-muted-foreground">
                      STEP {index + 1}
                    </span>
                    <p className="whitespace-pre-wrap">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              （AI ロードマップがまだ生成されていません）
            </p>
          )}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>90日ロードマップ</CardTitle>
        </CardHeader>
        <CardContent>
          {steps90.length > 0 ? (
            <ol className="relative border-l border-muted pl-4 space-y-3 text-sm">
              {steps90.map((step, index) => (
                <li key={index} className="ml-1">
                  <div className="absolute -left-[7px] mt-1 h-3 w-3 rounded-full bg-emerald-500" />
                  <div className="ml-3">
                    <span className="text-xs font-semibold text-muted-foreground">
                      PHASE {index + 1}
                    </span>
                    <p className="whitespace-pre-wrap">{step}</p>
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p className="whitespace-pre-wrap text-sm text-muted-foreground">
              （AI ロードマップがまだ生成されていません）
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}


