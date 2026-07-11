/**
 * POST /api/matriz-foda-pipeline
 *
 * Orquestador del pipeline de 4 agentes para la Matriz FODA Cruzada Completa:
 *   1. Recolector   — TypeScript puro, recopila todo el contexto STB
 *   2. Validador    — LLM: valida e identifica todas las combinaciones FODA
 *   3. Organizador  — LLM: genera TODAS las estrategias sin límite
 *   4. Revisor      — LLM: enriquece con metadatos para lectura directiva
 *
 * Retorna la MatrizFodaCompleta y el progreso de cada paso.
 */

import { NextRequest, NextResponse } from "next/server";
import { runRecolectorAgent } from "@/lib/agents/matrizFodaRecolector";
import { runValidadorAgent } from "@/lib/agents/matrizFodaValidador";
import { runOrganizadorAgent } from "@/lib/agents/matrizFodaOrganizador";
import { runRevisorAgent } from "@/lib/agents/matrizFodaRevisor";
import type {
  FODA,
  AnalisisEstrategico,
  ArbolProblemas,
  AnalisisPareto,
  ResultadoAuditoria,
  ArbolObjetivos,
  Hallazgo,
} from "@/types";

export const maxDuration = 300;

interface PipelineRequest {
  foda: FODA;
  debilidades_prioritarias: string[];
  analisis_estrategico: AnalisisEstrategico;
  hallazgos: Hallazgo[];
  arbol_problemas?: ArbolProblemas | null;
  pareto?: AnalisisPareto | null;
  auditoria?: ResultadoAuditoria | null;
  arbol_objetivos?: ArbolObjetivos | null;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as PipelineRequest;

    const {
      foda,
      debilidades_prioritarias,
      analisis_estrategico,
      hallazgos,
      arbol_problemas = null,
      pareto = null,
      auditoria = null,
      arbol_objetivos = null,
    } = body;

    if (!foda || !analisis_estrategico) {
      return NextResponse.json(
        { error: "Se requiere foda y analisis_estrategico" },
        { status: 400 }
      );
    }

    // ── Agente 1: RECOLECTOR ────────────────────────────────────────────────
    const { contexto, fuentes_disponibles } = runRecolectorAgent({
      foda,
      debilidades_prioritarias: debilidades_prioritarias ?? [],
      analisis_estrategico,
      hallazgos: hallazgos ?? [],
      arbol_problemas,
      pareto,
      auditoria,
      arbol_objetivos,
    });

    // ── Agente 2: VALIDADOR ─────────────────────────────────────────────────
    const contextoValidado = await runValidadorAgent(contexto);

    // ── Agente 3: ORGANIZADOR ───────────────────────────────────────────────
    const matrizCruzada = await runOrganizadorAgent(contextoValidado);

    // ── Agente 4: REVISOR ───────────────────────────────────────────────────
    const matrizCompleta = await runRevisorAgent(matrizCruzada, fuentes_disponibles);

    return NextResponse.json({
      matriz: matrizCompleta,
      stats: {
        total_combinaciones_validadas: contextoValidado.total_combinaciones_identificadas,
        total_estrategias: matrizCompleta.total_estrategias,
        fuentes: fuentes_disponibles,
      },
    });
  } catch (error) {
    console.error("[/api/matriz-foda-pipeline]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Error interno en el pipeline" },
      { status: 500 }
    );
  }
}
