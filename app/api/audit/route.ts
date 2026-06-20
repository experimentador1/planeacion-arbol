import { NextRequest, NextResponse } from "next/server";
import { runMethodologicalAuditorAgent } from "@/lib/agents/audit";
import type { ArbolProblemas } from "@/types";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as { arbol: ArbolProblemas };

    if (!body.arbol) {
      return NextResponse.json(
        { error: "Se requiere el árbol de problemas para auditar" },
        { status: 400 }
      );
    }

    const auditoria = await runMethodologicalAuditorAgent(body.arbol);
    return NextResponse.json(auditoria);
  } catch (error) {
    console.error("[Methodological Auditor] Error:", error);
    return NextResponse.json(
      { error: "Error en la auditoría metodológica." },
      { status: 500 }
    );
  }
}
