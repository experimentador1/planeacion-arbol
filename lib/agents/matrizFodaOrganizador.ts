/**
 * Agente 3 del Pipeline Matriz FODA: ORGANIZADOR
 *
 * Genera los 4 cuadrantes en llamadas LLM separadas para evitar
 * truncamiento por JSON demasiado grande.
 */

import { createLLM } from "@/lib/llm";
import { buildOrganizadorPrompt } from "@/lib/prompts/matrizFodaOrganizador";
import { repairJson } from "@/lib/utils/jsonRepair";
import type { ContextoValidado, MatrizFodaCruzada, CuadranteFODA } from "@/types";

const llm = createLLM(0.4);

async function generarCuadrante(
  tipo: "FO" | "FA" | "DO" | "DA",
  combinaciones: string[][],
  ctx: ContextoValidado["contexto"],
  tensiones: string[]
): Promise<CuadranteFODA> {
  const prompt = buildOrganizadorPrompt({
    tipo,
    combinaciones,
    tensiones,
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
  });

  const response = await llm.invoke([
    { role: "system", content: prompt },
    {
      role: "user",
      content:
        `Genera el cuadrante ${tipo} de la Matriz FODA Cruzada para DACYTI. ` +
        `Una estrategia por combinación validada. ` +
        `Devuelve ÚNICAMENTE el JSON del cuadrante ${tipo}, sin texto adicional.`,
    },
  ]);

  const content = typeof response.content === "string" ? response.content : "";

  let parsed: CuadranteFODA;
  try {
    const repairedJson = repairJson(content);
    parsed = JSON.parse(repairedJson) as CuadranteFODA;
  } catch {
    // Fallback: cuadrante vacío con mensaje de error como estrategia
    parsed = {
      tipo,
      titulo: `Estrategias ${tipo}`,
      orientacion: "Error en generación — regenere la matriz",
      descripcion_logica: "El agente no pudo generar este cuadrante correctamente.",
      estrategias: [],
    };
  }

  // Asegurar que el tipo es correcto
  parsed.tipo = tipo;
  if (!Array.isArray(parsed.estrategias)) parsed.estrategias = [];

  // Renumerar IDs para garantizar consistencia
  parsed.estrategias = parsed.estrategias.map((e, i) => ({
    ...e,
    id: `${tipo}-${i + 1}`,
  }));

  return parsed;
}

export async function runOrganizadorAgent(
  ctxValidado: ContextoValidado
): Promise<MatrizFodaCruzada> {
  const ctx = ctxValidado.contexto;
  const tensiones = ctxValidado.tensiones_estrategicas.map(
    (t) => `[${t.relevancia}] ${t.descripcion} → ${t.cuadrante_sugerido}`
  );

  // Generar los 4 cuadrantes en paralelo (llamadas LLM independientes)
  const [FO, FA, DO, DA] = await Promise.all([
    generarCuadrante("FO", ctxValidado.combinaciones_fo, ctx, tensiones),
    generarCuadrante("FA", ctxValidado.combinaciones_fa, ctx, tensiones),
    generarCuadrante("DO", ctxValidado.combinaciones_do, ctx, tensiones),
    generarCuadrante("DA", ctxValidado.combinaciones_da, ctx, tensiones),
  ]);

  const total =
    FO.estrategias.length +
    FA.estrategias.length +
    DO.estrategias.length +
    DA.estrategias.length;

  // Determinar cuadrante dominante por número de estrategias de alta prioridad
  const altas = {
    FO: FO.estrategias.filter((e) => e.prioridad === "ALTA").length,
    FA: FA.estrategias.filter((e) => e.prioridad === "ALTA").length,
    DO: DO.estrategias.filter((e) => e.prioridad === "ALTA").length,
    DA: DA.estrategias.filter((e) => e.prioridad === "ALTA").length,
  };
  const dominante = (Object.keys(altas) as ("FO" | "FA" | "DO" | "DA")[]).reduce(
    (a, b) => (altas[a] >= altas[b] ? a : b)
  );

  return {
    FO,
    FA,
    DO,
    DA,
    estrategia_dominante: `${dominante} — mayor concentración de estrategias de alta prioridad`,
    sintesis_ejecutiva:
      `La Matriz FODA Cruzada de DACYTI contiene ${total} estrategias operativas ` +
      `distribuidas en FO(${FO.estrategias.length}), FA(${FA.estrategias.length}), ` +
      `DO(${DO.estrategias.length}) y DA(${DA.estrategias.length}). ` +
      `El cuadrante dominante es ${dominante} con ${altas[dominante]} estrategias de alta prioridad.`,
    acciones_prioritarias: [
      ...FO.estrategias.filter((e) => e.prioridad === "ALTA").slice(0, 2).map((e) => `[FO] ${e.descripcion.slice(0, 80)}…`),
      ...FA.estrategias.filter((e) => e.prioridad === "ALTA").slice(0, 1).map((e) => `[FA] ${e.descripcion.slice(0, 80)}…`),
      ...DO.estrategias.filter((e) => e.prioridad === "ALTA").slice(0, 1).map((e) => `[DO] ${e.descripcion.slice(0, 80)}…`),
      ...DA.estrategias.filter((e) => e.prioridad === "ALTA").slice(0, 1).map((e) => `[DA] ${e.descripcion.slice(0, 80)}…`),
    ],
  };
}
