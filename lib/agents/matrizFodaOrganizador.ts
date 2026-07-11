/**
 * Agente 3 del Pipeline Matriz FODA: ORGANIZADOR
 *
 * Genera TODAS las estrategias operativas sin límite artificial,
 * usando las combinaciones validadas por el Agente 2.
 */

import { createLLM } from "@/lib/llm";
import { buildOrganizadorPrompt } from "@/lib/prompts/matrizFodaOrganizador";
import type { ContextoValidado, MatrizFodaCruzada } from "@/types";

// Temperatura 0.5 para creatividad estratégica sin alucinaciones
const llm = createLLM(0.5);

export async function runOrganizadorAgent(
  ctxValidado: ContextoValidado
): Promise<MatrizFodaCruzada> {
  const ctx = ctxValidado.contexto;

  const prompt = buildOrganizadorPrompt({
    combinaciones_fo: ctxValidado.combinaciones_fo,
    combinaciones_fa: ctxValidado.combinaciones_fa,
    combinaciones_do: ctxValidado.combinaciones_do,
    combinaciones_da: ctxValidado.combinaciones_da,
    tensiones: ctxValidado.tensiones_estrategicas.map(
      (t) => `[${t.relevancia}] ${t.descripcion} → ${t.cuadrante_sugerido}`
    ),
    observaciones: ctxValidado.observaciones_validacion,
    fortalezas: ctx.fortalezas,
    debilidades: ctx.debilidades,
    oportunidades: ctx.oportunidades,
    amenazas: ctx.amenazas,
    posicionamiento: ctx.posicionamiento,
    estrategia_generica: ctx.estrategia_generica,
    lineas_estrategicas: ctx.lineas_estrategicas,
    trade_offs: ctx.trade_offs,
    problema_central: ctx.problema_central,
    causas_criticas: ctx.causas_criticas,
    objetivo_central: ctx.objetivo_central,
    medios_directos: ctx.medios_directos,
  });

  const response = await llm.invoke([
    { role: "system", content: prompt },
    {
      role: "user",
      content:
        "Genera la Matriz FODA Cruzada completa para DACYTI. " +
        "IMPORTANTE: Una estrategia por cada combinación validada. " +
        "NO suprimas ninguna combinación. Incluye TODAS las estrategias que el análisis justifique. " +
        "Devuelve únicamente el JSON, sin texto adicional ni bloques de código.",
    },
  ]);

  const content = typeof response.content === "string" ? response.content : "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("El Agente Organizador no devolvió un JSON válido");
  }

  return JSON.parse(jsonMatch[0]) as MatrizFodaCruzada;
}
