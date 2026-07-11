"use client";

/**
 * MatrizFodaCompletaPdf
 *
 * PDF completo de la Matriz FODA Cruzada con todas las estrategias
 * generadas por el pipeline de 4 agentes.
 *
 * Estructura:
 *   Página 1   — Portada institucional + Síntesis ejecutiva + Fuentes
 *   Página 2   — Resumen estadístico + Acciones por horizonte temporal
 *   Página 3+  — Cuadrante FO (paginación automática)
 *   Página N+  — Cuadrante FA
 *   Página N+  — Cuadrante DO
 *   Página N+  — Cuadrante DA
 *   Última     — Índice de estrategias (tabla de referencia rápida)
 */

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type {
  MatrizFodaCompleta,
  EstrategiaOperativa,
  CuadranteFODA,
  MetadatoCuadrante,
} from "@/types";

// ─── Paleta ───────────────────────────────────────────────────────────────────
const C = {
  FO: { header: "#166534", light: "#f0fdf4", border: "#16a34a", accent: "#dcfce7" },
  FA: { header: "#1e3a8a", light: "#eff6ff", border: "#2563eb", accent: "#dbeafe" },
  DO: { header: "#92400e", light: "#fffbeb", border: "#d97706", accent: "#fef3c7" },
  DA: { header: "#9f1239", light: "#fff1f2", border: "#e11d48", accent: "#ffe4e6" },
  inst: "#1e3a5f",
  text: "#111827",
  muted: "#6b7280",
  border: "#e5e7eb",
  bg: "#f8fafc",
} as const;

const PRIORIDAD_DOT: Record<string, string> = {
  ALTA: "#dc2626",
  MEDIA: "#d97706",
  BAJA: "#16a34a",
};

const HORIZONTE_SIGLA: Record<string, string> = {
  INMEDIATO: "INM",
  CORTO_PLAZO: "CP",
  MEDIANO_PLAZO: "MP",
};

const HORIZONTE_LABEL: Record<string, string> = {
  INMEDIATO: "0–3 meses",
  CORTO_PLAZO: "3–12 meses",
  MEDIANO_PLAZO: "1–3 años",
};

// ─── Estilos ──────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: C.text,
    backgroundColor: "#ffffff",
    paddingTop: 22,
    paddingBottom: 34,
    paddingHorizontal: 28,
  },
  // ── Encabezado institucional ──────────────────────────────────────────────
  instHeader: {
    borderBottomWidth: 2,
    borderBottomColor: C.inst,
    marginBottom: 11,
    paddingBottom: 6,
  },
  instL1: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.inst, textAlign: "center", letterSpacing: 0.4 },
  instL2: { fontSize: 7, color: "#374151", textAlign: "center", marginTop: 1 },
  instL3: { fontSize: 6.5, color: C.muted, textAlign: "center", marginTop: 1, fontStyle: "italic" },
  // ── Portada ───────────────────────────────────────────────────────────────
  coverBox: {
    backgroundColor: C.inst,
    borderRadius: 6,
    paddingVertical: 22,
    paddingHorizontal: 24,
    alignItems: "center",
    marginBottom: 10,
  },
  coverTitle: { fontSize: 18, fontFamily: "Helvetica-Bold", color: "#ffffff", textAlign: "center" },
  coverSub: { fontSize: 10, color: "#93c5fd", textAlign: "center", marginTop: 5 },
  coverPill: {
    marginTop: 12,
    backgroundColor: "#1d4ed8",
    borderRadius: 4,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  coverPillText: { fontSize: 8, color: "#dbeafe", fontFamily: "Helvetica-Bold", letterSpacing: 0.4 },
  // ── Bloques de resumen ────────────────────────────────────────────────────
  box: {
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 4,
    backgroundColor: C.bg,
    padding: 10,
    marginBottom: 8,
  },
  boxTitle: { fontSize: 8.5, fontFamily: "Helvetica-Bold", color: C.inst, marginBottom: 5 },
  boxText: { fontSize: 8, color: "#374151", lineHeight: 1.5 },
  // ── Cuadrante page ────────────────────────────────────────────────────────
  cuadHeader: {
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 14,
    marginBottom: 8,
  },
  cuadTipo: { fontSize: 22, fontFamily: "Helvetica-Bold", color: "#ffffff" },
  cuadTitulo: { fontSize: 11, fontFamily: "Helvetica-Bold", color: "#ffffff", marginTop: 1 },
  cuadOrient: { fontSize: 8, color: "rgba(255,255,255,0.85)", marginTop: 2, fontStyle: "italic" },
  cuadLogica: {
    fontSize: 8,
    color: "#374151",
    fontStyle: "italic",
    lineHeight: 1.4,
    marginBottom: 8,
    paddingBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
  },
  cuadMeta: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
    flexWrap: "wrap",
  },
  cuadMetaItem: {
    fontSize: 7.5,
    color: C.muted,
  },
  cuadMetaVal: {
    fontFamily: "Helvetica-Bold",
    color: C.text,
  },
  // ── Estrategia row ────────────────────────────────────────────────────────
  estratRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 7,
    gap: 8,
  },
  estratNumCol: {
    width: 22,
    alignItems: "center",
  },
  estratNum: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.muted,
  },
  estratBody: { flex: 1 },
  estratDesc: { fontSize: 8.5, color: C.text, lineHeight: 1.5, marginBottom: 4 },
  estratInsight: {
    fontSize: 7.5,
    color: "#0369a1",
    fontStyle: "italic",
    lineHeight: 1.4,
    backgroundColor: "#f0f9ff",
    paddingVertical: 3,
    paddingHorizontal: 5,
    borderRadius: 2,
    borderLeftWidth: 2,
    borderLeftColor: "#0ea5e9",
    marginBottom: 4,
  },
  estratMetaRow: { flexDirection: "row", gap: 10, flexWrap: "wrap" },
  estratMetaItem: { fontSize: 7, color: C.muted },
  estratMetaKey: { fontFamily: "Helvetica-Bold", color: "#374151" },
  estratBadgeRow: { flexDirection: "row", gap: 4, marginTop: 3 },
  badge: { borderRadius: 3, paddingVertical: 1.5, paddingHorizontal: 4 },
  badgeText: { fontSize: 6.5, fontFamily: "Helvetica-Bold" },
  // ── Índice / tabla ────────────────────────────────────────────────────────
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: C.border,
    paddingVertical: 4,
    alignItems: "flex-start",
  },
  tableHeader: {
    backgroundColor: C.inst,
  },
  tableHeaderText: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    paddingHorizontal: 4,
  },
  tableCell: {
    fontSize: 7.5,
    color: C.text,
    paddingHorizontal: 4,
    lineHeight: 1.4,
  },
  tableCellId: { width: 38 },
  tableCellPrio: { width: 32 },
  tableCellHor: { width: 52 },
  tableCellResp: { width: 90 },
  tableCellDesc: { flex: 1 },
  // ── Horizonte sections ────────────────────────────────────────────────────
  horizSection: {
    marginBottom: 8,
    borderWidth: 1,
    borderRadius: 4,
    overflow: "hidden",
  },
  horizHeader: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  horizHeaderText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  horizBody: { padding: 8 },
  accionItem: {
    flexDirection: "row",
    gap: 5,
    marginBottom: 4,
  },
  accionNum: { fontSize: 8, fontFamily: "Helvetica-Bold", color: C.muted, width: 14 },
  accionText: { fontSize: 8, color: C.text, flex: 1, lineHeight: 1.4 },
  // ── Estadísticas ──────────────────────────────────────────────────────────
  statsGrid: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 1,
    padding: 8,
    alignItems: "center",
  },
  statNum: { fontSize: 22, fontFamily: "Helvetica-Bold" },
  statLabel: { fontSize: 7, marginTop: 2, textAlign: "center" },
  // ── Pie de página ─────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 14,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: C.border,
    paddingTop: 4,
  },
  footerText: { fontSize: 6, color: C.muted },
  sectionTitle: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: C.inst,
    marginBottom: 8,
    letterSpacing: 0.3,
  },
});

// ─── Componentes base ─────────────────────────────────────────────────────────

function InstHeader() {
  return (
    <View style={s.instHeader}>
      <Text style={s.instL1}>DIVISIÓN ACADÉMICA DE CIENCIAS Y TECNOLOGÍAS DE LA INFORMACIÓN</Text>
      <Text style={s.instL2}>INSUMOS PARA EL PLAN DE DESARROLLO 2026 · DOCUMENTO PARA REVISIÓN</Text>
      <Text style={s.instL3}>Matriz FODA Cruzada Completa · Pipeline 4 Agentes · STB v1.0</Text>
    </View>
  );
}

function Footer({ label }: { label: string }) {
  return (
    <View style={s.footer} fixed>
      <Text style={s.footerText}>DACYTI — Plan de Desarrollo 2026 · Confidencial</Text>
      <Text style={s.footerText}>{label}</Text>
    </View>
  );
}

function EstrategiaRow({
  estrategia,
  idx,
  dotColor,
}: {
  estrategia: EstrategiaOperativa;
  idx: number;
  dotColor: string;
}) {
  const prioColor = PRIORIDAD_DOT[estrategia.prioridad] ?? "#6b7280";
  return (
    <View style={s.estratRow}>
      <View style={s.estratNumCol}>
        <Text style={[s.estratNum, { color: dotColor }]}>{String(idx).padStart(2, "0")}</Text>
      </View>
      <View style={s.estratBody}>
        <Text style={s.estratDesc}>{estrategia.descripcion}</Text>

        {estrategia.insight_porter ? (
          <Text style={s.estratInsight}>⬡ Porter: {estrategia.insight_porter}</Text>
        ) : null}

        <View style={s.estratMetaRow}>
          {estrategia.fortalezas_vinculadas?.length > 0 && (
            <Text style={s.estratMetaItem}>
              <Text style={s.estratMetaKey}>F/D: </Text>
              {estrategia.fortalezas_vinculadas.slice(0, 2).join(" · ")}
            </Text>
          )}
          {estrategia.factores_externos_vinculados?.length > 0 && (
            <Text style={s.estratMetaItem}>
              <Text style={s.estratMetaKey}>O/A: </Text>
              {estrategia.factores_externos_vinculados.slice(0, 2).join(" · ")}
            </Text>
          )}
        </View>

        <View style={[s.estratMetaRow, { marginTop: 3 }]}>
          <Text style={s.estratMetaItem}>
            <Text style={s.estratMetaKey}>Indicador: </Text>
            {estrategia.indicador_exito}
          </Text>
        </View>

        <View style={[s.estratMetaRow, { marginTop: 2 }]}>
          <Text style={s.estratMetaItem}>
            <Text style={s.estratMetaKey}>Responsable: </Text>
            {estrategia.responsable_sugerido}
          </Text>
        </View>

        <View style={s.estratBadgeRow}>
          <View style={[s.badge, { backgroundColor: prioColor + "22" }]}>
            <Text style={[s.badgeText, { color: prioColor }]}>{estrategia.prioridad}</Text>
          </View>
          <View style={[s.badge, { backgroundColor: "#e0e7ff" }]}>
            <Text style={[s.badgeText, { color: "#4338ca" }]}>
              {HORIZONTE_LABEL[estrategia.horizonte] ?? estrategia.horizonte}
            </Text>
          </View>
          <Text style={[s.estratMetaItem, { alignSelf: "center" }]}>
            {estrategia.id}
          </Text>
        </View>
      </View>
    </View>
  );
}

function CuadrantePage({
  cuadrante,
  meta,
  pageLabel,
}: {
  cuadrante: CuadranteFODA;
  meta: MetadatoCuadrante;
  pageLabel: string;
}) {
  const colors = C[cuadrante.tipo];

  return (
    <Page size="A4" style={s.page}>
      <InstHeader />

      {/* Encabezado del cuadrante */}
      <View style={[s.cuadHeader, { backgroundColor: colors.header }]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <Text style={s.cuadTipo}>{cuadrante.tipo}</Text>
          <Text style={{ fontSize: 8, color: "rgba(255,255,255,0.75)" }}>
            {meta.total_estrategias} estrategias
          </Text>
        </View>
        <Text style={s.cuadTitulo}>{cuadrante.titulo}</Text>
        <Text style={s.cuadOrient}>{cuadrante.orientacion}</Text>
      </View>

      {/* Lógica del cuadrante */}
      <Text style={s.cuadLogica}>{cuadrante.descripcion_logica}</Text>

      {/* Metadatos del cuadrante */}
      <View style={s.cuadMeta}>
        <Text style={s.cuadMetaItem}>
          <Text style={s.cuadMetaVal}>Resumen: </Text>{meta.resumen_ejecutivo}
        </Text>
      </View>

      <View style={[s.cuadMeta, { marginBottom: 6 }]}>
        {[
          { label: "Alta prioridad", val: meta.prioridades.ALTA, color: "#dc2626" },
          { label: "Media prioridad", val: meta.prioridades.MEDIA, color: "#d97706" },
          { label: "Baja prioridad", val: meta.prioridades.BAJA, color: "#16a34a" },
          { label: "Inmediato", val: meta.horizontes.INMEDIATO, color: "#7c3aed" },
          { label: "Corto plazo", val: meta.horizontes.CORTO_PLAZO, color: "#0284c7" },
          { label: "Mediano plazo", val: meta.horizontes.MEDIANO_PLAZO, color: "#0f766e" },
        ].map(({ label, val, color }) => (
          <View key={label} style={[s.badge, { backgroundColor: color + "18" }]}>
            <Text style={[s.badgeText, { color }]}>{val} {label}</Text>
          </View>
        ))}
      </View>

      {/* Lista completa de estrategias */}
      <View>
        {cuadrante.estrategias.map((est, idx) => (
          <EstrategiaRow
            key={est.id}
            estrategia={est}
            idx={idx + 1}
            dotColor={colors.header}
          />
        ))}
      </View>

      {/* Mensaje para el director */}
      <View style={[s.box, { marginTop: 10, borderColor: colors.border, backgroundColor: colors.light }]}>
        <Text style={[s.boxTitle, { color: colors.header }]}>Mensaje para la Dirección</Text>
        <Text style={s.boxText}>{meta.mensaje_director}</Text>
      </View>

      <Footer label={pageLabel} />
    </Page>
  );
}

// ─── PDF Principal ─────────────────────────────────────────────────────────────

interface MatrizFodaCompletaPdfProps {
  matriz: MatrizFodaCompleta;
}

export function MatrizFodaCompletaPdf({ matriz }: MatrizFodaCompletaPdfProps) {
  const todosLosIds = [
    ...matriz.FO.estrategias,
    ...matriz.FA.estrategias,
    ...matriz.DO.estrategias,
    ...matriz.DA.estrategias,
  ];

  return (
    <Document
      title="Matriz FODA Cruzada Completa — DACYTI Plan de Desarrollo 2026"
      author="STB v1.0 — Pipeline 4 Agentes (Porter-Harvard)"
      subject="Estrategias Operativas Institucionales Exhaustivas"
    >
      {/* ── Página 1: Portada + Síntesis ──────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <InstHeader />

        <View style={s.coverBox}>
          <Text style={s.coverTitle}>MATRIZ FODA CRUZADA</Text>
          <Text style={s.coverSub}>Estrategias Operativas Institucionales — Versión Exhaustiva</Text>
          <View style={s.coverPill}>
            <Text style={s.coverPillText}>
              Pipeline 4 Agentes · Porter-Harvard · STB v1.0
            </Text>
          </View>
        </View>

        {/* Estadísticas globales */}
        <View style={s.statsGrid}>
          {([
            { tipo: "FO", n: matriz.FO.estrategias.length },
            { tipo: "FA", n: matriz.FA.estrategias.length },
            { tipo: "DO", n: matriz.DO.estrategias.length },
            { tipo: "DA", n: matriz.DA.estrategias.length },
          ] as const).map(({ tipo, n }) => (
            <View key={tipo} style={[s.statCard, { borderColor: C[tipo].border, backgroundColor: C[tipo].light }]}>
              <Text style={[s.statNum, { color: C[tipo].header }]}>{n}</Text>
              <Text style={[s.statLabel, { color: C[tipo].header }]}>Estrategias {tipo}</Text>
            </View>
          ))}
          <View style={[s.statCard, { borderColor: "#6366f1", backgroundColor: "#f0f0ff" }]}>
            <Text style={[s.statNum, { color: "#4338ca" }]}>{matriz.total_estrategias}</Text>
            <Text style={[s.statLabel, { color: "#4338ca" }]}>Total estrategias</Text>
          </View>
        </View>

        {/* Síntesis ejecutiva */}
        <View style={s.box}>
          <Text style={s.boxTitle}>SÍNTESIS EJECUTIVA</Text>
          <Text style={s.boxText}>{matriz.sintesis_ejecutiva}</Text>
        </View>

        {/* Mensaje para la dirección */}
        <View style={[s.box, { borderColor: C.inst, backgroundColor: "#eff6ff" }]}>
          <Text style={[s.boxTitle, { color: C.inst }]}>MENSAJE PARA EL COMITÉ DE PLANEACIÓN</Text>
          <Text style={s.boxText}>{matriz.mensaje_para_direccion}</Text>
          <Text style={[s.boxText, { marginTop: 5, fontFamily: "Helvetica-Bold" }]}>
            Estrategia dominante: {matriz.estrategia_dominante}
          </Text>
        </View>

        {/* Fuentes consideradas */}
        {matriz.fuentes_consideradas.length > 0 && (
          <View style={s.box}>
            <Text style={s.boxTitle}>FUENTES CONSIDERADAS</Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
              {matriz.fuentes_consideradas.map((f, i) => (
                <View key={i} style={[s.badge, { backgroundColor: "#f3f4f6", borderWidth: 0.5, borderColor: C.border }]}>
                  <Text style={[s.badgeText, { color: C.text }]}>{f}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Footer label="Página 1 — Portada" />
      </Page>

      {/* ── Página 2: Acciones por horizonte temporal ─────────────────────── */}
      <Page size="A4" style={s.page}>
        <InstHeader />

        <Text style={s.sectionTitle}>PLAN DE ACCIÓN POR HORIZONTE TEMPORAL</Text>

        {[
          {
            titulo: "ACCIONES INMEDIATAS (0–3 meses)",
            acciones: matriz.acciones_inmediatas,
            color: "#7c3aed",
            bg: "#f5f3ff",
          },
          {
            titulo: "ACCIONES A CORTO PLAZO (3–12 meses)",
            acciones: matriz.acciones_corto_plazo,
            color: "#0284c7",
            bg: "#f0f9ff",
          },
          {
            titulo: "ACCIONES A MEDIANO PLAZO (1–3 años)",
            acciones: matriz.acciones_mediano_plazo,
            color: "#0f766e",
            bg: "#f0fdfa",
          },
        ].map(({ titulo, acciones, color, bg }) => (
          <View key={titulo} style={[s.horizSection, { borderColor: color }]}>
            <View style={[s.horizHeader, { backgroundColor: color }]}>
              <Text style={s.horizHeaderText}>{titulo}</Text>
            </View>
            <View style={s.horizBody}>
              {acciones.length > 0 ? (
                acciones.map((a, i) => (
                  <View key={i} style={s.accionItem}>
                    <Text style={[s.accionNum, { color }]}>{i + 1}.</Text>
                    <Text style={s.accionText}>{a}</Text>
                  </View>
                ))
              ) : (
                <Text style={[s.boxText, { color: C.muted, fontStyle: "italic" }]}>
                  Sin acciones registradas para este horizonte.
                </Text>
              )}
            </View>
          </View>
        ))}

        {/* Resumen de metadatos por cuadrante */}
        <Text style={[s.sectionTitle, { marginTop: 8 }]}>RESUMEN EJECUTIVO POR CUADRANTE</Text>
        {(["FO", "FA", "DO", "DA"] as const).map((tipo) => {
          const colors = C[tipo];
          const meta = matriz.metadatos[tipo];
          return (
            <View
              key={tipo}
              style={[s.box, { borderColor: colors.border, backgroundColor: colors.light, marginBottom: 6 }]}
            >
              <View style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
                <Text style={{ fontSize: 14, fontFamily: "Helvetica-Bold", color: colors.header, width: 30 }}>
                  {tipo}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={s.boxText}>{meta.resumen_ejecutivo}</Text>
                </View>
              </View>
            </View>
          );
        })}

        <Footer label="Página 2 — Plan de Acción" />
      </Page>

      {/* ── Páginas de cuadrantes ─────────────────────────────────────────── */}
      {(["FO", "FA", "DO", "DA"] as const).map((tipo, i) => (
        <CuadrantePage
          key={tipo}
          cuadrante={matriz[tipo]}
          meta={matriz.metadatos[tipo]}
          pageLabel={`${tipo} — ${matriz[tipo].titulo}`}
        />
      ))}

      {/* ── Índice de referencia rápida ───────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <InstHeader />

        <Text style={s.sectionTitle}>
          ÍNDICE DE ESTRATEGIAS ({todosLosIds.length} en total)
        </Text>

        {/* Cabecera de tabla */}
        <View style={[s.tableRow, s.tableHeader]}>
          <Text style={[s.tableHeaderText, s.tableCellId]}>ID</Text>
          <Text style={[s.tableHeaderText, s.tableCellPrio]}>Prior.</Text>
          <Text style={[s.tableHeaderText, s.tableCellHor]}>Horizonte</Text>
          <Text style={[s.tableHeaderText, s.tableCellResp]}>Responsable</Text>
          <Text style={[s.tableHeaderText, s.tableCellDesc]}>Descripción (resumen)</Text>
        </View>

        {todosLosIds.map((est) => {
          const tipo = est.id.split("-")[0] as "FO" | "FA" | "DO" | "DA";
          const colors = C[tipo] ?? C.FO;
          return (
            <View key={est.id} style={s.tableRow}>
              <View style={[s.tableCellId]}>
                <Text style={[s.tableCell, { fontFamily: "Helvetica-Bold", color: colors.header }]}>
                  {est.id}
                </Text>
              </View>
              <View style={s.tableCellPrio}>
                <Text style={[s.tableCell, { color: PRIORIDAD_DOT[est.prioridad] }]}>
                  {est.prioridad}
                </Text>
              </View>
              <View style={s.tableCellHor}>
                <Text style={s.tableCell}>
                  {HORIZONTE_SIGLA[est.horizonte] ?? est.horizonte}
                  {" "}({HORIZONTE_LABEL[est.horizonte] ?? ""})
                </Text>
              </View>
              <View style={s.tableCellResp}>
                <Text style={s.tableCell}>{est.responsable_sugerido}</Text>
              </View>
              <View style={s.tableCellDesc}>
                <Text style={s.tableCell}>
                  {est.descripcion.slice(0, 120)}{est.descripcion.length > 120 ? "…" : ""}
                </Text>
              </View>
            </View>
          );
        })}

        <Footer label={`Índice · ${todosLosIds.length} estrategias totales`} />
      </Page>
    </Document>
  );
}
