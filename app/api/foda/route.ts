import { NextRequest, NextResponse } from "next/server";
import { runFODAAgent } from "@/lib/agents/foda";
import type { Hallazgo } from "@/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { hallazgos: Hallazgo[] };

    if (!body.hallazgos || body.hallazgos.length === 0) {
      return NextResponse.json(
        { error: "Se requieren hallazgos para generar el FODA" },
        { status: 400 }
      );
    }

    const resultado = await runFODAAgent(body.hallazgos);

    return NextResponse.json(resultado);
  } catch (error) {
    console.error("[FODA Agent] Error:", error);
    return NextResponse.json(
      { error: "Error generando análisis FODA. Intenta de nuevo." },
      { status: 500 }
    );
  }
}
