import { NextRequest, NextResponse } from "next/server";
import { runProblemArchitectAgent } from "@/lib/agents/problem";
import type { FODA } from "@/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      foda: FODA;
      debilidades_prioritarias: string[];
    };

    if (!body.foda) {
      return NextResponse.json(
        { error: "Se requiere el FODA validado" },
        { status: 400 }
      );
    }

    const candidatos = await runProblemArchitectAgent(
      body.foda,
      body.debilidades_prioritarias ?? []
    );

    return NextResponse.json({ candidatos });
  } catch (error) {
    console.error("[Problem Architect] Error:", error);
    return NextResponse.json(
      { error: "Error identificando candidatos al Problema Central." },
      { status: 500 }
    );
  }
}
