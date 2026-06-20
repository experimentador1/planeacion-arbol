import { createLLM } from "@/lib/llm";
import { CAUSAL_PROMPT } from "@/lib/prompts/causal";
import type { Hallazgo, ArbolProblemas } from "@/types";

const llm = createLLM(0.2);

export async function runCausalDesignerAgent(
  problemaCentral: string,
  hallazgos: Hallazgo[]
): Promise<ArbolProblemas> {
  const contexto = hallazgos
    .filter((h) => h.tipo === "PROBLEMA" || h.tipo === "CAUSA" || h.tipo === "EFECTO")
    .map((h) => `[${h.tipo}] ${h.enunciado} — Fuente: ${h.fuente}, p.${h.pagina}`)
    .join("\n");

  const prompt = CAUSAL_PROMPT
    .replace("{problema_central}", problemaCentral)
    .replace("{contexto}", contexto);

  const response = await llm.invoke([
    { role: "system", content: prompt },
    {
      role: "user",
      content: `Construye el árbol de causas y efectos para el Problema Central: "${problemaCentral}".\n\nContexto documental disponible:\n${contexto}`,
    },
  ]);

  const content = typeof response.content === "string" ? response.content : "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("El Causal Designer no devolvió un JSON válido");
  }

  return JSON.parse(jsonMatch[0]) as ArbolProblemas;
}
