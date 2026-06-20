import { NextRequest, NextResponse } from "next/server";
import { runCausalDesignerAgent } from "@/lib/agents/causal";
import { runParetoFilterAgent } from "@/lib/agents/pareto";
import type { Hallazgo } from "@/types";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json() as {
      problema_central: string;
      hallazgos: Hallazgo[];
    };

    if (!body.problema_central) {
      return NextResponse.json(
        { error: "Se requiere el Problema Central confirmado" },
        { status: 400 }
      );
    }

    // Ejecutar Causal Designer
    const arbol = await runCausalDesignerAgent(body.problema_central, body.hallazgos);

    // Ejecutar Pareto Filter sobre el árbol generado
    const pareto = await runParetoFilterAgent(arbol);

    // Enriquecer causas directas con datos de Pareto
    const arbolEnriquecido = {
      ...arbol,
      causas_directas: arbol.causas_directas.map((causa) => {
        const paretoCausa = pareto.causas_priorizadas.find((p) => p.id === causa.id);
        return {
          ...causa,
          puntaje_pareto: paretoCausa?.puntaje_total ?? 0,
          clasificacion_pareto: paretoCausa?.clasificacion ?? "SECUNDARIA",
        };
      }),
    };

    return NextResponse.json({ arbol: arbolEnriquecido, pareto });
  } catch (error) {
    console.error("[Causal Designer] Error:", error);
    return NextResponse.json(
      { error: "Error construyendo el Árbol de Problemas." },
      { status: 500 }
    );
  }
}
