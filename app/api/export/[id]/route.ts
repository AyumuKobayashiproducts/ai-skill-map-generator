import { NextResponse } from "next/server";
import { createSupabaseClient } from "@/lib/supabaseClient";
import { getRequestLocale } from "@/lib/apiLocale";
import { getApiError } from "@/lib/apiErrors";

interface RouteParams {
  params: {
    id: string;
  };
}

export async function GET(request: Request, { params }: RouteParams) {
  const supabase = createSupabaseClient();

  const { data, error } = await supabase
    .from("skill_maps")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error || !data) {
    const locale = getRequestLocale(request);
    const { code, message } = getApiError(
      "EXPORT_SKILLMAP_NOT_FOUND",
      locale
    );
    return NextResponse.json(
      { error: message, code },
      { status: 404 }
    );
  }

  const createdAt = data.created_at
    ? new Date(data.created_at).toISOString().slice(0, 10)
    : "";

  const categories = (data.categories ?? {}) as Record<string, number | null>;

  const mdLines: string[] = [];
  mdLines.push(`# AI Skill Map Report`);
  mdLines.push("");
  mdLines.push(`- ID: \`${data.id}\``);
  if (createdAt) {
    mdLines.push(`- Date: ${createdAt}`);
  }
  mdLines.push("");

  mdLines.push("## 1. Skill Map (0–5)");
  mdLines.push("");
  mdLines.push("| Category | Level |");
  mdLines.push("|----------|-------|");
  for (const [key, value] of Object.entries(categories)) {
    mdLines.push(`| ${key} | ${value ?? "-"} |`);
  }
  mdLines.push("");

  mdLines.push("## 2. Strengths");
  mdLines.push("");
  mdLines.push(data.strengths ?? "");
  mdLines.push("");

  mdLines.push("## 3. Weaknesses");
  mdLines.push("");
  mdLines.push(data.weaknesses ?? "");
  mdLines.push("");

  mdLines.push("## 4. 30-day Roadmap");
  mdLines.push("");
  mdLines.push(data.roadmap_30 ?? "");
  mdLines.push("");

  mdLines.push("## 5. 90-day Roadmap");
  mdLines.push("");
  mdLines.push(data.roadmap_90 ?? "");
  mdLines.push("");

  const body = mdLines.join("\n");

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="skill-map-${data.id}.md"`
    }
  });
}



