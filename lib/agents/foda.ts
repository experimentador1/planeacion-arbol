import { createLLM } from "@/lib/llm";
import { FODA_PROMPT } from "@/lib/prompts/foda";
import type { Hallazgo, ResultadoFODA } from "@/types";

const llm = createLLM(0.2);

export async function runFODAAgent(hallazgos: Hallazgo[]): Promise<ResultadoFODA> {
  const resumen = hallazgos
    .map((h) => `[${h.tipo}] ${h.enunciado} (${h.fuente}, p.${h.pagina})`)
    .join("\n");

  const response = await llm.invoke([
    { role: "system", content: FODA_PROMPT },
    {
      role: "user",
      content: `Clasifica los siguientes hallazgos institucionales en la matriz FODA:\n\n${resumen}`,
    },
  ]);

  const content = typeof response.content === "string" ? response.content : "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("El agente FODA no devolvió un JSON válido");
  }

  return JSON.parse(jsonMatch[0]) as ResultadoFODA;
}
