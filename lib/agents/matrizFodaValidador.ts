/**
 * Agente 2 del Pipeline Matriz FODA: VALIDADOR
 *
 * Valida el contexto recolectado e identifica TODAS las combinaciones
 * FODA que merecen una estrategia operativa.
 */

import { createLLM } from "@/lib/llm";
import { buildValidadorPrompt } from "@/lib/prompts/matrizFodaValidador";
import { repairJson } from "@/lib/utils/jsonRepair";
import type { ContextoCompleto, ContextoValidado } from "@/types";

const MAX_COMBINACIONES_POR_CUADRANTE = 15;

const llm = createLLM(0.2);

export async function runValidadorAgent(
  contexto: ContextoCompleto
): Promise<ContextoValidado> {
  const prompt = buildValidadorPrompt(contexto);

  const response = await llm.invoke([
    { role: "system", content: prompt },
    {
      role: "user",
      content:
        "Valida el contexto institucional de DACYTI e identifica TODAS las combinaciones " +
        "FODA que merecen estrategias operativas. No omitas ninguna combinación relevante. " +
        "Devuelve únicamente el JSON solicitado.",
    },
  ]);

  const content = typeof response.content === "string" ? response.content : "";

  let parsed: Omit<ContextoValidado, "contexto">;
  try {
    const repairedJson = repairJson(content);
    parsed = JSON.parse(repairedJson) as Omit<ContextoValidado, "contexto">;
  } catch {
    throw new Error("El Agente Validador no devolvió un JSON válido");
  }

  // Aplicar límite de combinaciones por cuadrante para evitar JSON truncado
  const cap = MAX_COMBINACIONES_POR_CUADRANTE;
  const fo = (parsed.combinaciones_fo ?? []).slice(0, cap);
  const fa = (parsed.combinaciones_fa ?? []).slice(0, cap);
  const doC = (parsed.combinaciones_do ?? []).slice(0, cap);
  const da = (parsed.combinaciones_da ?? []).slice(0, cap);

  return {
    contexto,
    tensiones_estrategicas: parsed.tensiones_estrategicas ?? [],
    combinaciones_fo: fo,
    combinaciones_fa: fa,
    combinaciones_do: doC,
    combinaciones_da: da,
    observaciones_validacion: parsed.observaciones_validacion ?? [],
    total_combinaciones_identificadas: fo.length + fa.length + doC.length + da.length,
  };
}
