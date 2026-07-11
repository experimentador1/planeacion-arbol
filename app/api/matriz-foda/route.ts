import { NextRequest, NextResponse } from "next/server";
import { runMatrizFodaAgent } from "@/lib/agents/matrizFoda";
import type { FODA, AnalisisEstrategico } from "@/types";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as {
      foda: FODA;
      analisis_estrategico: AnalisisEstrategico;
    };

    const { foda, analisis_estrategico } = body;

    if (!foda || !analisis_estrategico) {
      return NextResponse.json(
        { error: "Se requiere foda y analisis_estrategico" },
        { status: 400 }
      );
    }

    const matriz = await runMatrizFodaAgent(foda, analisis_estrategico);

    return NextResponse.json({ matriz });
  } catch (error) {
    console.error("[/api/matriz-foda]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno" },
      { status: 500 }
    );
  }
}
