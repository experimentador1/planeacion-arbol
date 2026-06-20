import { createLLM } from "@/lib/llm";
import { AUDIT_PROMPT } from "@/lib/prompts/audit";
import type { ArbolProblemas, ResultadoAuditoria } from "@/types";

const llm = createLLM(0.1);

export async function runMethodologicalAuditorAgent(
  arbol: ArbolProblemas
): Promise<ResultadoAuditoria> {
  const arbolTexto = JSON.stringify(arbol, null, 2);

  const response = await llm.invoke([
    { role: "system", content: AUDIT_PROMPT },
    {
      role: "user",
      content: `Audita metodológicamente el siguiente Árbol de Problemas bajo los criterios de Marco Lógico:\n\n${arbolTexto}`,
    },
  ]);

  const content = typeof response.content === "string" ? response.content : "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("El Auditor Metodológico no devolvió un JSON válido");
  }

  return JSON.parse(jsonMatch[0]) as ResultadoAuditoria;
}
