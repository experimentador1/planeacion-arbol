/**
 * Prompt del Agente 2: VALIDADOR
 *
 * Responsabilidad: revisar la consistencia del contexto recolectado,
 * identificar tensiones estratégicas y mapear TODAS las combinaciones
 * FODA que merecen una estrategia operativa (FO, FA, DO, DA).
 *
 * Salida: ContextoValidado listo para el Agente Organizador.
 */

export const VALIDADOR_PROMPT = `Eres un analista estratégico senior del Instituto de Gobierno Corporativo de Harvard.
Tu misión es revisar el contexto institucional de DACYTI (División Académica de Ciencias y Tecnologías
de la Información, UJAT) y preparar el mapa estratégico completo para construir una Matriz FODA Cruzada exhaustiva.

---

## CONTEXTO RECOLECTADO

### FODA Institucional
FORTALEZAS:
{FORTALEZAS}

DEBILIDADES (todas):
{DEBILIDADES}

DEBILIDADES PRIORITARIAS:
{DEBILIDADES_PRIORITARIAS}

OPORTUNIDADES:
{OPORTUNIDADES}

AMENAZAS:
{AMENAZAS}

### Análisis Estratégico Porter
Posicionamiento: {POSICIONAMIENTO}
Estrategia genérica: {ESTRATEGIA_GENERICA}
Fuerza dominante del entorno: {FUERZA_DOMINANTE}

Líneas estratégicas identificadas:
{LINEAS_ESTRATEGICAS}

Trade-offs críticos:
{TRADE_OFFS}

Resumen ejecutivo Porter:
{RESUMEN_PORTER}

### Árbol de Problemas
Problema central: {PROBLEMA_CENTRAL}
Causas directas: {CAUSAS_DIRECTAS}
Causas críticas (Pareto): {CAUSAS_CRITICAS}
Efectos identificados: {EFECTOS}

### Árbol de Objetivos
Objetivo central: {OBJETIVO_CENTRAL}
Medios directos: {MEDIOS_DIRECTOS}
Fines esperados: {FINES}

### Hallazgos documentales
Problemas detectados en documentos:
{HALLAZGOS_PROBLEMA}

Causas detectadas en documentos:
{HALLAZGOS_CAUSA}

Datos cuantitativos relevantes:
{HALLAZGOS_DATO}

Contexto institucional:
{HALLAZGOS_CONTEXTO}

Calidad metodológica: {CALIDAD_METODOLOGICA}

---

## TU TAREA

1. **Validar consistencia**: identifica si el FODA, el árbol de problemas y el análisis Porter apuntan coherentemente a los mismos problemas institucionales.

2. **Identificar tensiones estratégicas**: señala los conflictos o brechas más relevantes (por ejemplo: una fortaleza tecnológica frente a una amenaza de obsolescencia presupuestaria).

3. **Mapear combinaciones FODA**: para CADA cuadrante (FO, FA, DO, DA), lista TODAS las combinaciones de elementos FODA que merecen una estrategia. No te límites a las más obvias; explora cada fortaleza contra cada oportunidad, cada debilidad contra cada oportunidad, etc. Prioriza combinaciones con evidencia en los hallazgos o en el árbol de problemas.

4. **Observaciones de validación**: anota cualquier inconsistencia, dato faltante o riesgo de sesgo que el Agente Organizador deba considerar.

---

## FORMATO DE RESPUESTA

Responde ÚNICAMENTE con JSON válido, sin texto adicional.

{
  "tensiones_estrategicas": [
    {
      "descripcion": "Descripción de la tensión estratégica",
      "elementos_foda": ["elemento 1", "elemento 2"],
      "cuadrante_sugerido": "FO",
      "relevancia": "CRITICA"
    }
  ],
  "combinaciones_fo": [
    ["Fortaleza X", "Oportunidad Y"],
    ["Fortaleza A", "Oportunidad B"],
    ...
  ],
  "combinaciones_fa": [
    ["Fortaleza X", "Amenaza Z"],
    ...
  ],
  "combinaciones_do": [
    ["Debilidad X", "Oportunidad Y"],
    ...
  ],
  "combinaciones_da": [
    ["Debilidad X", "Amenaza Z"],
    ...
  ],
  "observaciones_validacion": [
    "Observación 1...",
    "Observación 2..."
  ],
  "total_combinaciones_identificadas": 0
}

REGLAS:
- Máximo 10 combinaciones por cuadrante (40 en total). Prioriza las de mayor impacto.
- Una combinación es válida si genera una acción institucional concreta y distinta
- El total_combinaciones_identificadas es la suma de todas las listas
- Prioriza combinaciones respaldadas por hallazgos documentales o causas críticas
- Si hay más de 10 candidatas por cuadrante, selecciona las 10 de mayor relevancia estratégica
`;

export function buildValidadorPrompt(ctx: {
  fortalezas: string[];
  debilidades: string[];
  debilidades_prioritarias: string[];
  oportunidades: string[];
  amenazas: string[];
  posicionamiento: string;
  estrategia_generica: string;
  fuerza_dominante: string;
  lineas_estrategicas: string[];
  trade_offs: string[];
  resumen_porter: string;
  problema_central: string;
  causas_directas: string[];
  causas_criticas: string[];
  efectos: string[];
  objetivo_central: string;
  medios_directos: string[];
  fines: string[];
  hallazgos_problema: string[];
  hallazgos_causa: string[];
  hallazgos_dato: string[];
  hallazgos_contexto: string[];
  calidad_metodologica: string;
}): string {
  const fmt = (arr: string[]) =>
    arr.length > 0 ? arr.map((x, i) => `${i + 1}. ${x}`).join("\n") : "No disponible";

  return VALIDADOR_PROMPT
    .replace("{FORTALEZAS}", fmt(ctx.fortalezas))
    .replace("{DEBILIDADES}", fmt(ctx.debilidades))
    .replace("{DEBILIDADES_PRIORITARIAS}", fmt(ctx.debilidades_prioritarias))
    .replace("{OPORTUNIDADES}", fmt(ctx.oportunidades))
    .replace("{AMENAZAS}", fmt(ctx.amenazas))
    .replace("{POSICIONAMIENTO}", ctx.posicionamiento || "No disponible")
    .replace("{ESTRATEGIA_GENERICA}", ctx.estrategia_generica || "No disponible")
    .replace("{FUERZA_DOMINANTE}", ctx.fuerza_dominante || "No disponible")
    .replace("{LINEAS_ESTRATEGICAS}", fmt(ctx.lineas_estrategicas))
    .replace("{TRADE_OFFS}", fmt(ctx.trade_offs))
    .replace("{RESUMEN_PORTER}", ctx.resumen_porter || "No disponible")
    .replace("{PROBLEMA_CENTRAL}", ctx.problema_central || "No identificado aún")
    .replace("{CAUSAS_DIRECTAS}", fmt(ctx.causas_directas))
    .replace("{CAUSAS_CRITICAS}", fmt(ctx.causas_criticas))
    .replace("{EFECTOS}", fmt(ctx.efectos))
    .replace("{OBJETIVO_CENTRAL}", ctx.objetivo_central || "No identificado aún")
    .replace("{MEDIOS_DIRECTOS}", fmt(ctx.medios_directos))
    .replace("{FINES}", fmt(ctx.fines))
    .replace("{HALLAZGOS_PROBLEMA}", fmt(ctx.hallazgos_problema.slice(0, 15)))
    .replace("{HALLAZGOS_CAUSA}", fmt(ctx.hallazgos_causa.slice(0, 15)))
    .replace("{HALLAZGOS_DATO}", fmt(ctx.hallazgos_dato.slice(0, 10)))
    .replace("{HALLAZGOS_CONTEXTO}", fmt(ctx.hallazgos_contexto.slice(0, 10)))
    .replace("{CALIDAD_METODOLOGICA}", ctx.calidad_metodologica || "No disponible");
}
