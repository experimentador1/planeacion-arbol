import { createLLM } from "@/lib/llm";
import { PROBLEM_PROMPT } from "@/lib/prompts/problem";
import type { FODA, CandidatoProblema } from "@/types";

const llm = createLLM(0.2);

export async function runProblemArchitectAgent(
  foda: FODA,
  debilidades_prioritarias: string[]
): Promise<CandidatoProblema[]> {
  const fodaResumen = `
DEBILIDADES (materia prima del árbol de problemas):
${foda.debilidades.map((d) => `- ${d.enunciado}`).join("\n")}

DEBILIDADES PRIORITARIAS (ordenadas por peso):
${debilidades_prioritarias.map((d, i) => `${i + 1}. ${d}`).join("\n")}

AMENAZAS:
${foda.amenazas.map((a) => `- ${a.enunciado}`).join("\n")}

FORTALEZAS:
${foda.fortalezas.map((f) => `- ${f.enunciado}`).join("\n")}

OPORTUNIDADES:
${foda.oportunidades.map((o) => `- ${o.enunciado}`).join("\n")}
`;

  const response = await llm.invoke([
    { role: "system", content: PROBLEM_PROMPT },
    {
      role: "user",
      content: `Con base en el siguiente análisis FODA institucional, identifica los 3 candidatos a Problema Central:\n\n${fodaResumen}`,
    },
  ]);

  const content = typeof response.content === "string" ? response.content : "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("El Problem Architect no devolvió un JSON válido");
  }

  const parsed = JSON.parse(jsonMatch[0]) as { candidatos: CandidatoProblema[] };
  return parsed.candidatos;
}
