/**
 * Conductor — Orquestador principal del flujo multiagente STB.
 *
 * Coordina 7 agentes especializados con puntos de validación humana.
 * No ejecuta agentes directamente; expone funciones auxiliares de validación
 * y ruteo que las API Routes invocan según el paso activo del flujo.
 */

import type { PasoFlujo } from "@/types";

/** Orden canónico del flujo de agentes */
export const FLUJO_AGENTES: PasoFlujo[] = [
  "upload",
  "foda",
  "problem",
  "causal",
  "audit",
  "objectives",
  "export",
];

/** Puntos donde se requiere validación humana antes de continuar */
export const PUNTOS_VALIDACION: PasoFlujo[] = ["foda", "problem", "audit"];

/** Devuelve el siguiente paso en el flujo */
export function siguientePaso(actual: PasoFlujo): PasoFlujo | null {
  const idx = FLUJO_AGENTES.indexOf(actual);
  if (idx === -1 || idx === FLUJO_AGENTES.length - 1) return null;
  return FLUJO_AGENTES[idx + 1];
}

/** Indica si el paso actual requiere confirmación humana */
export function requiereValidacion(paso: PasoFlujo): boolean {
  return PUNTOS_VALIDACION.includes(paso);
}

/** Labels descriptivos para cada paso (uso en UI) */
export const PASO_LABELS: Record<PasoFlujo, string> = {
  upload: "Carga de Documentos",
  foda: "Análisis FODA",
  problem: "Problema Central",
  causal: "Árbol de Problemas",
  audit: "Auditoría Metodológica",
  objectives: "Árbol de Objetivos",
  export: "Exportación PDF",
};

/** Metadatos de agentes para visualización de estado */
export const AGENTE_META = {
  librarian: { nombre: "Librarian Agent", descripcion: "Extracción documental" },
  foda: { nombre: "FODA Agent", descripcion: "Clasificación estratégica" },
  problem: { nombre: "Problem Architect", descripcion: "Identificación del problema" },
  causal: { nombre: "Causal Designer", descripcion: "Árbol de causas y efectos" },
  pareto: { nombre: "Pareto Filter", descripcion: "Priorización 80/20" },
  audit: { nombre: "Methodological Auditor", descripcion: "Validación Marco Lógico" },
  export: { nombre: "Format Painter", descripcion: "Exportación DACYTI" },
} as const;
