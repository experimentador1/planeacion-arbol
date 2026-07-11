import { createLLM } from "@/lib/llm";
import { STRATEGIES_PROMPT } from "@/lib/prompts/strategies";
import type { FODA, Hallazgo, AnalisisEstrategico } from "@/types";

const llm = createLLM(0.3);

export async function runStrategicAdvisorAgent(
  foda: FODA,
  debilidades_prioritarias: string[],
  hallazgos: Hallazgo[]
): Promise<AnalisisEstrategico> {
  const fortalezas = foda.fortalezas.map((f) => `• ${f.enunciado}`).join("\n");
  const debilidades = foda.debilidades.map((d) => `• ${d.enunciado}`).join("\n");
  const oportunidades = foda.oportunidades.map((o) => `• ${o.enunciado}`).join("\n");
  const amenazas = foda.amenazas.map((a) => `• ${a.enunciado}`).join("\n");

  const debilidadesPrioritariasTexto = debilidades_prioritarias
    .map((d) => `• ${d}`)
    .join("\n");

  const evidencia = hallazgos
    .filter((h) => h.tipo === "DATO" || h.tipo === "CONTEXTO" || h.tipo === "PROBLEMA")
    .slice(0, 18)
    .map((h) => `[${h.tipo}] ${h.enunciado} — ${h.fuente}, p.${h.pagina}`)
    .join("\n");

  const prompt = STRATEGIES_PROMPT
    .replace("{fortalezas}", fortalezas || "No definidas")
    .replace("{debilidades_prioritarias}", debilidadesPrioritariasTexto || "No definidas")
    .replace("{debilidades}", debilidades || "No definidas")
    .replace("{oportunidades}", oportunidades || "No definidas")
    .replace("{amenazas}", amenazas || "No definidas")
    .replace("{evidencia}", evidencia || "No disponible");

  const response = await llm.invoke([
    { role: "system", content: prompt },
    {
      role: "user",
      content:
        "Genera el análisis estratégico institucional completo bajo el marco Porter para este organismo. Devuelve únicamente el JSON solicitado, sin texto adicional.",
    },
  ]);

  const content = typeof response.content === "string" ? response.content : "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("El Strategic Advisor no devolvió un JSON válido");
  }

  return JSON.parse(jsonMatch[0]) as AnalisisEstrategico;
}
