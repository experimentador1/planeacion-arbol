import { NextRequest, NextResponse } from "next/server";
import { runParetoFilterAgent } from "@/lib/agents/pareto";
import type { ArbolProblemas } from "@/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { arbol: ArbolProblemas };

    if (!body.arbol) {
      return NextResponse.json(
        { error: "Se requiere el árbol de problemas" },
        { status: 400 }
      );
    }

    const pareto = await runParetoFilterAgent(body.arbol);
    return NextResponse.json(pareto);
  } catch (error) {
    console.error("[Pareto Filter] Error:", error);
    return NextResponse.json(
      { error: "Error calculando análisis de Pareto." },
      { status: 500 }
    );
  }
}
