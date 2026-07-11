/**
 * Agente 2 del Pipeline Matriz FODA: VALIDADOR
 *
 * Valida el contexto recolectado e identifica TODAS las combinaciones
 * FODA que merecen una estrategia operativa.
 */

import { createLLM } from "@/lib/llm";
import { buildValidadorPrompt } from "@/lib/prompts/matrizFodaValidador";
import type { ContextoCompleto, ContextoValidado } from "@/types";

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
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("El Agente Validador no devolvió un JSON válido");
  }

  const parsed = JSON.parse(jsonMatch[0]) as Omit<ContextoValidado, "contexto">;

  return {
    contexto,
    tensiones_estrategicas: parsed.tensiones_estrategicas ?? [],
    combinaciones_fo: parsed.combinaciones_fo ?? [],
    combinaciones_fa: parsed.combinaciones_fa ?? [],
    combinaciones_do: parsed.combinaciones_do ?? [],
    combinaciones_da: parsed.combinaciones_da ?? [],
    observaciones_validacion: parsed.observaciones_validacion ?? [],
    total_combinaciones_identificadas: parsed.total_combinaciones_identificadas ?? 0,
  };
}
