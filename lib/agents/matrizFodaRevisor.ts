/**
 * Agente 4 del Pipeline Matriz FODA: REVISOR
 *
 * Enriquece la MatrizFodaCruzada con metadatos de gestión,
 * resúmenes ejecutivos y acciones clasificadas por horizonte temporal.
 * Produce la MatrizFodaCompleta lista para el PDF.
 */

import { createLLM } from "@/lib/llm";
import { buildRevisorPrompt } from "@/lib/prompts/matrizFodaRevisor";
import { repairJson } from "@/lib/utils/jsonRepair";
import type { MatrizFodaCruzada, MatrizFodaCompleta, MetadatoCuadrante } from "@/types";

const llm = createLLM(0.25);

const defaultMeta = (cuadrante: MatrizFodaCruzada["FO"]): MetadatoCuadrante => ({
  total_estrategias: cuadrante.estrategias.length,
  prioridades: {
    ALTA: cuadrante.estrategias.filter((e) => e.prioridad === "ALTA").length,
    MEDIA: cuadrante.estrategias.filter((e) => e.prioridad === "MEDIA").length,
    BAJA: cuadrante.estrategias.filter((e) => e.prioridad === "BAJA").length,
  },
  horizontes: {
    INMEDIATO: cuadrante.estrategias.filter((e) => e.horizonte === "INMEDIATO").length,
    CORTO_PLAZO: cuadrante.estrategias.filter((e) => e.horizonte === "CORTO_PLAZO").length,
    MEDIANO_PLAZO: cuadrante.estrategias.filter((e) => e.horizonte === "MEDIANO_PLAZO").length,
  },
  resumen_ejecutivo: `El cuadrante ${cuadrante.tipo} contiene ${cuadrante.estrategias.length} estrategias.`,
  mensaje_director: `Revisar y priorizar las estrategias del cuadrante ${cuadrante.tipo}.`,
});

export async function runRevisorAgent(
  matriz: MatrizFodaCruzada,
  fuentesDisponibles: string[]
): Promise<MatrizFodaCompleta> {
  const matrizJson = JSON.stringify(matriz, null, 2);
  const prompt = buildRevisorPrompt(matrizJson);

  let parsed: Partial<{
    metadatos: MatrizFodaCompleta["metadatos"];
    mensaje_para_direccion: string;
    acciones_inmediatas: string[];
    acciones_corto_plazo: string[];
    acciones_mediano_plazo: string[];
    fuentes_consideradas: string[];
  }> = {};

  try {
    const response = await llm.invoke([
      { role: "system", content: prompt },
      {
        role: "user",
        content:
          "Revisa la Matriz FODA Cruzada y añade los metadatos de gestión para lectura humana directiva. " +
          "Devuelve únicamente el JSON solicitado, sin texto adicional.",
      },
    ]);

    const content = typeof response.content === "string" ? response.content : "";
    try {
      const repairedJson = repairJson(content);
      parsed = JSON.parse(repairedJson);
    } catch {
      // parsed queda vacío, se usan defaults abajo
    }
  } catch {
    // Si el revisor falla, construimos metadatos básicos automáticamente
  }

  const total_estrategias =
    matriz.FO.estrategias.length +
    matriz.FA.estrategias.length +
    matriz.DO.estrategias.length +
    matriz.DA.estrategias.length;

  return {
    FO: matriz.FO,
    FA: matriz.FA,
    DO: matriz.DO,
    DA: matriz.DA,
    metadatos: parsed.metadatos ?? {
      FO: defaultMeta(matriz.FO),
      FA: defaultMeta(matriz.FA),
      DO: defaultMeta(matriz.DO),
      DA: defaultMeta(matriz.DA),
    },
    total_estrategias,
    estrategia_dominante: matriz.estrategia_dominante,
    sintesis_ejecutiva: matriz.sintesis_ejecutiva,
    mensaje_para_direccion:
      parsed.mensaje_para_direccion ??
      `La Matriz FODA Cruzada de DACYTI contiene ${total_estrategias} estrategias operativas distribuidas en cuatro cuadrantes. Se recomienda revisar prioritariamente el cuadrante dominante identificado.`,
    acciones_inmediatas: parsed.acciones_inmediatas ?? matriz.acciones_prioritarias.slice(0, 3),
    acciones_corto_plazo: parsed.acciones_corto_plazo ?? matriz.acciones_prioritarias.slice(3, 6),
    acciones_mediano_plazo: parsed.acciones_mediano_plazo ?? [],
    fuentes_consideradas: parsed.fuentes_consideradas ?? fuentesDisponibles,
  };
}
