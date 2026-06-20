import { NextRequest, NextResponse } from "next/server";
import { runFormatPainterAgent } from "@/lib/agents/mirror";
import type { ArbolProblemas } from "@/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { arbol: ArbolProblemas };

    if (!body.arbol) {
      return NextResponse.json(
        { error: "Se requiere el árbol de problemas auditado" },
        { status: 400 }
      );
    }

    const arbolObjetivos = await runFormatPainterAgent(body.arbol);
    return NextResponse.json({ arbol_objetivos: arbolObjetivos });
  } catch (error) {
    console.error("[Format Painter] Error:", error);
    return NextResponse.json(
      { error: "Error generando el Árbol de Objetivos." },
      { status: 500 }
    );
  }
}
