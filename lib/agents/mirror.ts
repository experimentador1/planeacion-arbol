import { createLLM } from "@/lib/llm";
import { MIRROR_PROMPT } from "@/lib/prompts/mirror";
import type { ArbolProblemas, ArbolObjetivos } from "@/types";

const llm = createLLM(0.3);

export async function runFormatPainterAgent(
  arbol: ArbolProblemas
): Promise<ArbolObjetivos> {
  const arbolTexto = JSON.stringify(arbol, null, 2);

  const response = await llm.invoke([
    { role: "system", content: MIRROR_PROMPT },
    {
      role: "user",
      content: `Convierte el siguiente Árbol de Problemas en un Árbol de Objetivos siguiendo las reglas de Marco Lógico:\n\n${arbolTexto}`,
    },
  ]);

  const content = typeof response.content === "string" ? response.content : "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("El Format Painter no devolvió un JSON válido");
  }

  return JSON.parse(jsonMatch[0]) as ArbolObjetivos;
}
