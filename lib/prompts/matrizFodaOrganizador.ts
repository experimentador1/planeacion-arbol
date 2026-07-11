/**
 * Prompt del Agente 3: ORGANIZADOR
 *
 * Genera UN cuadrante a la vez para evitar respuestas JSON truncadas.
 * Se invoca 4 veces (FO, FA, DO, DA) con el contexto del cuadrante específico.
 */

export const ORGANIZADOR_PROMPT = `Eres el Director de Estrategia Institucional de una universidad pública de México.
Tienes formación en el modelo Porter-Harvard y dominas la planificación institucional en organismos
públicos educativos sujetos a normativa SEP/UJAT.

Tu misión: construir la Matriz FODA Cruzada EXHAUSTIVA para DACYTI.

---

## CUADRANTE A GENERAR: {TIPO_CUADRANTE}

Lógica del cuadrante: {LOGICA_CUADRANTE}

Combinaciones validadas para este cuadrante:
{COMBINACIONES}

---

## CONTEXTO INSTITUCIONAL

FODA:
- Fortalezas: {FORTALEZAS}
- Debilidades: {DEBILIDADES}
- Oportunidades: {OPORTUNIDADES}
- Amenazas: {AMENAZAS}

Análisis Porter:
- Posicionamiento: {POSICIONAMIENTO}
- Estrategia genérica: {ESTRATEGIA_GENERICA}
- Líneas estratégicas: {LINEAS_ESTRATEGICAS}
- Trade-offs: {TRADE_OFFS}

Problema central: {PROBLEMA_CENTRAL}
Causas críticas: {CAUSAS_CRITICAS}
Objetivo central: {OBJETIVO_CENTRAL}

Tensiones estratégicas:
{TENSIONES}

---

## REGLAS

1. Una estrategia por combinación validada. Usa el prefijo correcto: {PREFIJO}-1, {PREFIJO}-2, …
2. Cada estrategia debe ser accionable en DACYTI (presupuesto público, normativa UJAT/SEP).
3. Cita los elementos FODA específicos y el insight Porter relevante.
4. El indicador_exito debe ser cuantificable o verificable.
5. Responde SOLO con el JSON del cuadrante, sin texto adicional.

---

## FORMATO DE RESPUESTA

{
  "tipo": "{TIPO_CUADRANTE}",
  "titulo": "Título del cuadrante",
  "orientacion": "Orientación estratégica en 1 oración",
  "descripcion_logica": "Descripción de la lógica específica para DACYTI (2-3 oraciones)",
  "estrategias": [
    {
      "id": "{PREFIJO}-1",
      "descripcion": "Descripción clara y accionable (2-3 oraciones)",
      "fortalezas_vinculadas": ["elemento FODA"],
      "factores_externos_vinculados": ["elemento FODA"],
      "insight_porter": "Insight Porter que respalda esta estrategia",
      "prioridad": "ALTA",
      "indicador_exito": "Indicador medible",
      "responsable_sugerido": "Área de DACYTI",
      "horizonte": "CORTO_PLAZO"
    }
  ]
}
`;

const LOGICAS: Record<string, string> = {
  FO: "Maxi-Maxi: usa Fortalezas para capitalizar Oportunidades (estrategias ofensivas/crecimiento)",
  FA: "Maxi-Mini: usa Fortalezas para neutralizar Amenazas (estrategias defensivas/adaptación)",
  DO: "Mini-Maxi: supera Debilidades aprovechando Oportunidades (estrategias de reorientación/mejora)",
  DA: "Mini-Mini: minimiza Debilidades para reducir vulnerabilidad ante Amenazas (supervivencia/contención)",
};

export function buildOrganizadorPrompt(ctx: {
  tipo: string;
  combinaciones: string[][];
  tensiones: string[];
  fortalezas: string[];
  debilidades: string[];
  oportunidades: string[];
  amenazas: string[];
  posicionamiento: string;
  estrategia_generica: string;
  lineas_estrategicas: string[];
  trade_offs: string[];
  problema_central: string;
  causas_criticas: string[];
  objetivo_central: string;
}): string {
  const fmtCombinaciones = (combinaciones: string[][]): string =>
    combinaciones.length > 0
      ? combinaciones.map((c, i) => `  ${i + 1}. [${c.join("] × [")}]`).join("\n")
      : "  (ninguna identificada)";

  const fmt = (arr: string[]): string =>
    arr.length > 0 ? arr.map((x, i) => `  ${i + 1}. ${x}`).join("\n") : "  No disponible";

  return ORGANIZADOR_PROMPT
    .replace(/{TIPO_CUADRANTE}/g, ctx.tipo)
    .replace(/{PREFIJO}/g, ctx.tipo)
    .replace("{LOGICA_CUADRANTE}", LOGICAS[ctx.tipo] ?? "")
    .replace("{COMBINACIONES}", fmtCombinaciones(ctx.combinaciones))
    .replace("{TENSIONES}", fmt(ctx.tensiones))
    .replace("{FORTALEZAS}", fmt(ctx.fortalezas))
    .replace("{DEBILIDADES}", fmt(ctx.debilidades))
    .replace("{OPORTUNIDADES}", fmt(ctx.oportunidades))
    .replace("{AMENAZAS}", fmt(ctx.amenazas))
    .replace("{POSICIONAMIENTO}", ctx.posicionamiento || "No disponible")
    .replace("{ESTRATEGIA_GENERICA}", ctx.estrategia_generica || "No disponible")
    .replace("{LINEAS_ESTRATEGICAS}", fmt(ctx.lineas_estrategicas))
    .replace("{TRADE_OFFS}", fmt(ctx.trade_offs))
    .replace("{PROBLEMA_CENTRAL}", ctx.problema_central || "No identificado")
    .replace("{CAUSAS_CRITICAS}", fmt(ctx.causas_criticas))
    .replace("{OBJETIVO_CENTRAL}", ctx.objetivo_central || "No identificado");
}
