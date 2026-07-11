import { createLLM } from "@/lib/llm";
import { buildMatrizFodaPrompt } from "@/lib/prompts/matrizFoda";
import type { FODA, AnalisisEstrategico, MatrizFodaCruzada } from "@/types";

const llm = createLLM(0.35);

export async function runMatrizFodaAgent(
  foda: FODA,
  analisisEstrategico: AnalisisEstrategico
): Promise<MatrizFodaCruzada> {
  const lineasTexto = analisisEstrategico.lineas_estrategicas
    .map((l) => {
      const estrategiasTexto = l.estrategias
        .map((e) => `  - ${e.nombre}: ${e.descripcion} [${e.prioridad}]`)
        .join("\n");
      return `Línea "${l.nombre}" (${l.tipo}):\n${estrategiasTexto}`;
    })
    .join("\n\n");

  const prompt = buildMatrizFodaPrompt(
    {
      fortalezas: foda.fortalezas.map((f) => f.enunciado),
      debilidades: foda.debilidades.map((d) => d.enunciado),
      oportunidades: foda.oportunidades.map((o) => o.enunciado),
      amenazas: foda.amenazas.map((a) => a.enunciado),
    },
    {
      posicionamiento: analisisEstrategico.posicionamiento_recomendado,
      estrategia_generica: analisisEstrategico.estrategia_generica,
      fuerza_dominante: analisisEstrategico.cinco_fuerzas.fuerza_dominante,
      lineas_estrategicas: lineasTexto,
      trade_offs: analisisEstrategico.trade_offs_criticos,
      calce_actividades: analisisEstrategico.calce_actividades,
    }
  );

  const response = await llm.invoke([
    { role: "system", content: prompt },
    {
      role: "user",
      content:
        "Construye la Matriz FODA Cruzada completa con estrategias operativas para DACYTI. " +
        "Devuelve únicamente el JSON solicitado, sin texto adicional ni bloques de código.",
    },
  ]);

  const content = typeof response.content === "string" ? response.content : "";
  const jsonMatch = content.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("El agente Matriz FODA no devolvió un JSON válido");
  }

  return JSON.parse(jsonMatch[0]) as MatrizFodaCruzada;
}
