import { createLLM } from "@/lib/llm";
import { PARETO_PROMPT } from "@/lib/prompts/pareto";
import type { ArbolProblemas, AnalisisPareto } from "@/types";

const llm = createLLM(0.1);

export async function runParetoFilterAgent(
  arbol: ArbolProblemas
): Promise<AnalisisPareto> {
  const causasTexto = arbol.causas_directas
    .map(
      (c) =>
        `ID: ${c.id}\nEnunciado: ${c.enunciado}\nCausas secundarias: ${c.causas_secundarias.map((cs) => cs.enunciado).join("; ")}`
    )
    .join("\n\n");

  const response = await llm.invoke([
    { role: "system", content: PARETO_PROMPT },
    {
      role: "user",
      content: `Evalúa y prioriza las siguientes causas directas del Problema Central "${arbol.problema_central}":\n\n${causasTexto}`,
    },
  ]);

  const content = typeof response.content === "string" ? response.content : "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("El Pareto Filter no devolvió un JSON válido");
  }

  return JSON.parse(jsonMatch[0]) as AnalisisPareto;
}
