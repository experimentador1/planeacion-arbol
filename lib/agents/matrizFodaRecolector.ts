/**
 * Agente 1 del Pipeline Matriz FODA: RECOLECTOR
 *
 * Responsabilidad: Compilar TODA la información disponible del proceso STB
 * en un único objeto `ContextoCompleto` estructurado.
 *
 * No utiliza LLM — es lógica TypeScript pura para garantizar exhaustividad.
 */

import type {
  FODA,
  AnalisisEstrategico,
  ArbolProblemas,
  AnalisisPareto,
  ResultadoAuditoria,
  ArbolObjetivos,
  Hallazgo,
  ContextoCompleto,
} from "@/types";

interface RecolectorInput {
  foda: FODA;
  debilidades_prioritarias: string[];
  analisis_estrategico: AnalisisEstrategico;
  hallazgos: Hallazgo[];
  arbol_problemas: ArbolProblemas | null;
  pareto: AnalisisPareto | null;
  auditoria: ResultadoAuditoria | null;
  arbol_objetivos: ArbolObjetivos | null;
}

export interface RecolectorOutput {
  contexto: ContextoCompleto;
  fuentes_disponibles: string[];
}

export function runRecolectorAgent(input: RecolectorInput): RecolectorOutput {
  const {
    foda,
    debilidades_prioritarias,
    analisis_estrategico,
    hallazgos,
    arbol_problemas,
    pareto,
    auditoria,
    arbol_objetivos,
  } = input;

  // ── FODA ──────────────────────────────────────────────────────────────────
  const fortalezas = foda.fortalezas.map((f) => f.enunciado);
  const debilidades = foda.debilidades.map((d) => d.enunciado);
  const oportunidades = foda.oportunidades.map((o) => o.enunciado);
  const amenazas = foda.amenazas.map((a) => a.enunciado);

  // ── Porter ────────────────────────────────────────────────────────────────
  const lineas_estrategicas = analisis_estrategico.lineas_estrategicas.flatMap(
    (l) =>
      l.estrategias.map(
        (e) =>
          `[${l.tipo}] ${e.nombre}: ${e.descripcion} — Ventaja: ${e.ventaja_distintiva} — Trade-off: ${e.trade_off} [${e.prioridad}]`
      )
  );

  // ── Árbol de Problemas ────────────────────────────────────────────────────
  const causas_directas = arbol_problemas
    ? arbol_problemas.causas_directas.map(
        (c) =>
          `${c.enunciado} [Pareto: ${c.clasificacion_pareto}]`
      )
    : [];

  const causas_criticas = pareto
    ? pareto.causas_criticas
    : arbol_problemas
    ? arbol_problemas.causas_directas
        .filter((c) => c.clasificacion_pareto === "CRÍTICA")
        .map((c) => c.enunciado)
    : [];

  const efectos = arbol_problemas
    ? arbol_problemas.efectos.map((e) => e.enunciado)
    : [];

  // ── Árbol de Objetivos ────────────────────────────────────────────────────
  const medios_directos = arbol_objetivos
    ? arbol_objetivos.medios_directos.map((m) => m.enunciado)
    : [];

  const fines = arbol_objetivos
    ? arbol_objetivos.fines.map((f) => f.enunciado)
    : [];

  // ── Hallazgos documentales ────────────────────────────────────────────────
  const formatHallazgo = (h: Hallazgo) =>
    `${h.enunciado} [Fuente: ${h.fuente}, p.${h.pagina}]`;

  const hallazgos_problema = hallazgos
    .filter((h) => h.tipo === "PROBLEMA")
    .map(formatHallazgo);

  const hallazgos_causa = hallazgos
    .filter((h) => h.tipo === "CAUSA")
    .map(formatHallazgo);

  const hallazgos_dato = hallazgos
    .filter((h) => h.tipo === "DATO")
    .map(formatHallazgo);

  const hallazgos_contexto = hallazgos
    .filter((h) => h.tipo === "CONTEXTO")
    .map(formatHallazgo);

  // ── Auditoría ─────────────────────────────────────────────────────────────
  const calidad_metodologica = auditoria
    ? `${auditoria.calidad_metodologica} — Aprobado: ${auditoria.aprobado}`
    : "No disponible";

  const observaciones_auditoria = auditoria
    ? auditoria.observaciones_generales
    : "Auditoría no realizada en este flujo.";

  // ── Fuentes disponibles ───────────────────────────────────────────────────
  const fuentesDisponibles: string[] = [
    "Análisis FODA institucional",
    "Análisis Estratégico Porter (Strategic Advisor)",
    ...(arbol_problemas ? ["Árbol de Problemas"] : []),
    ...(pareto ? ["Análisis de Pareto de causas"] : []),
    ...(auditoria ? ["Auditoría metodológica"] : []),
    ...(arbol_objetivos ? ["Árbol de Objetivos"] : []),
    ...(hallazgos.length > 0
      ? [`Hallazgos documentales (${hallazgos.length} registros)`]
      : []),
  ];

  const contexto: ContextoCompleto = {
    fortalezas,
    debilidades,
    oportunidades,
    amenazas,
    debilidades_prioritarias,
    posicionamiento: analisis_estrategico.posicionamiento_recomendado,
    estrategia_generica: analisis_estrategico.estrategia_generica,
    fuerza_dominante: analisis_estrategico.cinco_fuerzas.fuerza_dominante,
    lineas_estrategicas,
    trade_offs: analisis_estrategico.trade_offs_criticos,
    calce_actividades: analisis_estrategico.calce_actividades,
    resumen_porter: analisis_estrategico.resumen_ejecutivo,
    problema_central: arbol_problemas?.problema_central ?? "",
    causas_directas,
    causas_criticas,
    efectos,
    objetivo_central: arbol_objetivos?.objetivo_central ?? "",
    medios_directos,
    fines,
    hallazgos_problema,
    hallazgos_causa,
    hallazgos_dato,
    hallazgos_contexto,
    calidad_metodologica,
    observaciones_auditoria,
  };

  return { contexto, fuentes_disponibles: fuentesDisponibles };
}
