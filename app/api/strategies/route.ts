import { NextRequest, NextResponse } from "next/server";
import { runStrategicAdvisorAgent } from "@/lib/agents/strategies";
import type { FODA, Hallazgo } from "@/types";

export const maxDuration = 120;

interface StrategiesRequest {
  foda: FODA;
  debilidades_prioritarias: string[];
  hallazgos: Hallazgo[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as StrategiesRequest;

    if (!body.foda) {
      return NextResponse.json(
        { error: "Se requiere el análisis FODA para generar las estrategias" },
        { status: 400 }
      );
    }

    const analisis = await runStrategicAdvisorAgent(
      body.foda,
      body.debilidades_prioritarias ?? [],
      body.hallazgos ?? []
    );

    return NextResponse.json({ analisis_estrategico: analisis });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Error desconocido";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
