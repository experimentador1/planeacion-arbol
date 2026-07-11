"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type {
  FODA,
  AnalisisEstrategico,
  ArbolProblemas,
  AnalisisPareto,
  ResultadoAuditoria,
  ArbolObjetivos,
  TipoEstrategiaPorter,
  MatrizFodaCompleta,
} from "@/types";

// ─── Estilos ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingTop: 24,
    paddingBottom: 36,
    paddingHorizontal: 32,
    fontFamily: "Helvetica",
  },
  // ── Encabezado institucional (aparece en cada página) ────────────────────
  instHeader: {
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a5f",
    marginBottom: 14,
    paddingBottom: 8,
  },
  instLine1: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  instLine2: {
    fontSize: 8,
    color: "#374151",
    textAlign: "center",
    marginTop: 2,
  },
  instLine3: {
    fontSize: 7,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 1,
    fontFamily: "Helvetica-Oblique",
  },
  // ── Sección ──────────────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 10,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#dbeafe",
  },
  // ── Portada ──────────────────────────────────────────────────────────────
  coverBox: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
  },
  coverOrg: {
    fontSize: 11,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    textAlign: "center",
    marginBottom: 24,
  },
  coverTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    textAlign: "center",
  },
  coverSub: {
    fontSize: 13,
    color: "#374151",
    textAlign: "center",
    marginTop: 6,
  },
  coverBadge: {
    backgroundColor: "#fef3c7",
    borderColor: "#d97706",
    borderWidth: 1,
    borderRadius: 4,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 20,
  },
  coverBadgeText: {
    fontSize: 9,
    color: "#92400e",
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  coverDate: {
    fontSize: 8,
    color: "#9ca3af",
    textAlign: "center",
    marginTop: 8,
  },
  // ── FODA ──────────────────────────────────────────────────────────────────
  fodaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  fodaCell: {
    width: "48%",
    borderRadius: 4,
    padding: 8,
    marginBottom: 6,
  },
  fodaLabel: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  fodaItem: {
    fontSize: 7,
    marginBottom: 2,
    paddingLeft: 6,
  },
  // ── Porter ────────────────────────────────────────────────────────────────
  fuerzaRow: {
    flexDirection: "row",
    borderWidth: 1,
    borderRadius: 4,
    marginBottom: 6,
    overflow: "hidden",
  },
  fuerzaBadge: {
    width: 52,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  fuerzaBadgeText: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  fuerzaContent: {
    flex: 1,
    padding: 6,
  },
  fuerzaNombre: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#374151",
    marginBottom: 2,
  },
  fuerzaDesc: {
    fontSize: 7,
    color: "#6b7280",
    marginBottom: 2,
  },
  fuerzaImpl: {
    fontSize: 7,
    color: "#1d4ed8",
    fontFamily: "Helvetica-Oblique",
  },
  posBox: {
    backgroundColor: "#1e3a5f",
    borderRadius: 4,
    padding: 10,
    marginBottom: 10,
  },
  posLabel: {
    fontSize: 7,
    color: "#93c5fd",
    fontFamily: "Helvetica-Bold",
    marginBottom: 3,
    textTransform: "uppercase",
  },
  posText: {
    fontSize: 8,
    color: "#ffffff",
  },
  estrategiaCard: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 4,
    padding: 8,
    marginBottom: 8,
  },
  estrategiaNombre: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 3,
  },
  estrategiaDesc: {
    fontSize: 7,
    color: "#4b5563",
    marginBottom: 4,
  },
  estrategiaField: {
    fontSize: 7,
    color: "#374151",
    marginBottom: 2,
  },
  estrategiaFieldLabel: {
    fontFamily: "Helvetica-Bold",
  },
  tradeOffBox: {
    backgroundColor: "#fef2f2",
    borderColor: "#fca5a5",
    borderWidth: 1,
    borderRadius: 3,
    padding: 5,
    marginBottom: 4,
  },
  tradeOffText: {
    fontSize: 7,
    color: "#991b1b",
  },
  calceBox: {
    backgroundColor: "#eff6ff",
    borderColor: "#bfdbfe",
    borderWidth: 1,
    borderRadius: 3,
    padding: 5,
    marginBottom: 4,
  },
  calceText: {
    fontSize: 7,
    color: "#1e40af",
  },
  resumenBox: {
    backgroundColor: "#f8fafc",
    borderColor: "#cbd5e1",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  resumenText: {
    fontSize: 8,
    color: "#334155",
    lineHeight: 1.5,
  },
  // ── Árbol de Problemas / Objetivos ────────────────────────────────────────
  centralBox: {
    borderWidth: 2,
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    alignSelf: "center",
    width: "70%",
  },
  centralLabel: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 3,
    textAlign: "center",
  },
  centralText: {
    fontSize: 9,
    textAlign: "center",
  },
  treeRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginBottom: 10,
  },
  treeNodeBox: {
    flex: 1,
    minWidth: "22%",
    borderRadius: 4,
    borderWidth: 1,
    padding: 5,
  },
  treeNodeId: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  treeNodeText: {
    fontSize: 7,
  },
  treeChildBox: {
    borderRadius: 3,
    borderWidth: 1,
    padding: 4,
    marginLeft: 6,
    marginTop: 3,
  },
  treeChildText: {
    fontSize: 6,
  },
  // ── Pareto ────────────────────────────────────────────────────────────────
  paretoRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#f3f4f6",
    paddingVertical: 4,
    paddingHorizontal: 4,
    alignItems: "center",
  },
  paretoCell: {
    fontSize: 7,
    color: "#374151",
  },
  paretoBadge: {
    borderRadius: 3,
    paddingVertical: 1,
    paddingHorizontal: 4,
  },
  // ── Auditoría ─────────────────────────────────────────────────────────────
  auditBadge: {
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  auditBadgeText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  auditObsBox: {
    backgroundColor: "#f9fafb",
    borderColor: "#e5e7eb",
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginBottom: 10,
  },
  auditObsText: {
    fontSize: 8,
    color: "#374151",
  },
  auditErrorBox: {
    borderWidth: 1,
    borderRadius: 4,
    padding: 6,
    marginBottom: 6,
    backgroundColor: "#fffbeb",
    borderColor: "#fcd34d",
  },
  auditErrorNodo: {
    fontSize: 6,
    fontFamily: "Helvetica-Bold",
    color: "#92400e",
    marginBottom: 2,
  },
  auditErrorDesc: {
    fontSize: 7,
    color: "#374151",
    marginBottom: 2,
  },
  auditErrorSug: {
    fontSize: 7,
    color: "#b45309",
    fontFamily: "Helvetica-Oblique",
  },
  // ── Lista plana de estrategias ────────────────────────────────────────────
  estrategiaRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
    paddingVertical: 6,
    gap: 6,
  },
  estrategiaNum: {
    width: 20,
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
    textAlign: "right",
  },
  estrategiaBody: { flex: 1 },
  estrategiaTitulo: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 2,
  },
  estrategiaDescText: {
    fontSize: 7.5,
    color: "#374151",
    lineHeight: 1.4,
    marginBottom: 3,
  },
  estrategiaMetaRow: { flexDirection: "row", gap: 8, flexWrap: "wrap" },
  estrategiaMetaText: { fontSize: 7, color: "#6b7280" },
  estrategiaMetaLabel: { fontFamily: "Helvetica-Bold", color: "#374151" },
  estrategiaBadge: {
    borderRadius: 3,
    paddingVertical: 1,
    paddingHorizontal: 4,
    marginTop: 3,
    alignSelf: "flex-start",
  },
  // ── Matriz FODA Cruzada (2×2) ─────────────────────────────────────────────
  matrizGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
  },
  matrizCell: {
    width: "48.5%",
    borderRadius: 4,
    borderWidth: 1.5,
    overflow: "hidden",
    marginBottom: 4,
  },
  matrizCellHeader: {
    paddingVertical: 6,
    paddingHorizontal: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  matrizCellTipo: {
    fontSize: 12,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  matrizCellTitulo: {
    fontSize: 7.5,
    color: "rgba(255,255,255,0.85)",
    fontFamily: "Helvetica-Bold",
  },
  matrizCellCount: {
    fontSize: 7,
    color: "rgba(255,255,255,0.7)",
  },
  matrizCellBody: { padding: 6 },
  matrizEstrategiaItem: {
    flexDirection: "row",
    gap: 4,
    marginBottom: 4,
    paddingBottom: 3,
    borderBottomWidth: 0.3,
    borderBottomColor: "#e5e7eb",
  },
  matrizNumero: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    width: 14,
  },
  matrizItemBody: { flex: 1 },
  matrizItemDesc: { fontSize: 7, color: "#111827", lineHeight: 1.4, marginBottom: 1 },
  matrizItemMeta: { fontSize: 6.5, color: "#6b7280" },
  // ── Footer ────────────────────────────────────────────────────────────────
  footer: {
    position: "absolute",
    bottom: 14,
    left: 32,
    right: 32,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
    paddingTop: 4,
  },
  footerText: {
    fontSize: 6,
    color: "#9ca3af",
  },
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const TIPO_LABELS: Record<TipoEstrategiaPorter, string> = {
  DIFERENCIACION: "Diferenciación",
  EFICIENCIA_INSTITUCIONAL: "Eficiencia Institucional",
  ENFOQUE: "Enfoque",
};

const PRIORIDAD_COLOR: Record<string, string> = {
  ALTA: "#dc2626",
  MEDIA: "#d97706",
  BAJA: "#16a34a",
};

const HORIZONTE_LABEL: Record<string, string> = {
  INMEDIATO: "0–3 m",
  CORTO_PLAZO: "3–12 m",
  MEDIANO_PLAZO: "1–3 a",
};

const CUADRANTE_COLORS: Record<string, { header: string; light: string; border: string }> = {
  FO: { header: "#166534", light: "#f0fdf4", border: "#16a34a" },
  FA: { header: "#1e3a8a", light: "#eff6ff", border: "#2563eb" },
  DO: { header: "#92400e", light: "#fffbeb", border: "#d97706" },
  DA: { header: "#9f1239", light: "#fff1f2", border: "#e11d48" },
};

function InstHeader({ fecha }: { fecha: string }) {
  return (
    <View style={s.instHeader}>
      <Text style={s.instLine1}>
        DIVISIÓN ACADÉMICA DE CIENCIAS Y TECNOLOGÍAS DE LA INFORMACIÓN
      </Text>
      <Text style={s.instLine2}>INSUMOS PARA EL PLAN DE DESARROLLO 2026</Text>
      <Text style={s.instLine3}>DOCUMENTO PARA REVISIÓN · {fecha}</Text>
    </View>
  );
}

function Footer({ pagina, total }: { pagina: number; total: number }) {
  return (
    <View style={s.footer}>
      <Text style={s.footerText}>Strategic Tree Builder v1.0 · DACYTI</Text>
      <Text style={s.footerText}>
        Página {pagina} de {total}
      </Text>
    </View>
  );
}

// ─── Props ────────────────────────────────────────────────────────────────────

interface Props {
  foda: FODA | null;
  analisisEstrategico: AnalisisEstrategico | null;
  matrizFodaCompleta?: MatrizFodaCompleta | null;
  arbolProblemas: ArbolProblemas | null;
  pareto: AnalisisPareto | null;
  auditoria: ResultadoAuditoria | null;
  arbolObjetivos: ArbolObjetivos | null;
}

// ─── Documento ────────────────────────────────────────────────────────────────

export function ReportePdf({
  foda,
  analisisEstrategico,
  matrizFodaCompleta,
  arbolProblemas,
  pareto,
  auditoria,
  arbolObjetivos,
}: Props) {
  const fecha = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  // Contar páginas dinámicamente para el footer
  let paginaActual = 0;
  const totalPaginas =
    1 + // portada
    (foda ? 1 : 0) +
    (analisisEstrategico ? 1 : 0) + // Lista plana de estrategias Porter
    (matrizFodaCompleta ? 1 : 0) +  // Matriz FODA Cruzada
    (arbolProblemas ? 1 : 0) +
    (pareto ? 1 : 0) +
    (auditoria ? 1 : 0) +
    (arbolObjetivos ? 1 : 0);

  const nextPag = () => {
    paginaActual += 1;
    return paginaActual;
  };

  return (
    <Document>
      {/* ────────────────────────────────────────────────────────── PORTADA */}
      <Page size="A4" style={s.page}>
        <InstHeader fecha={fecha} />
        <View style={[s.coverBox, { marginTop: 60 }]}>
          <Text style={s.coverOrg}>
            DIVISIÓN ACADÉMICA DE CIENCIAS Y TECNOLOGÍAS DE LA INFORMACIÓN
          </Text>
          <View style={{ alignItems: "center", gap: 6 }}>
            <Text style={s.coverTitle}>PLAN DE DESARROLLO 2026</Text>
            <Text style={s.coverSub}>
              Insumos para la Planeación Estratégica Institucional
            </Text>
          </View>
          <View style={s.coverBadge}>
            <Text style={s.coverBadgeText}>DOCUMENTO PARA REVISIÓN</Text>
          </View>
          <Text style={s.coverDate}>Generado el {fecha} · Strategic Tree Builder v1.0</Text>
          <Text style={[s.coverDate, { marginTop: 40, color: "#d1d5db" }]}>
            Marco Lógico · Análisis Estratégico Porter (Harvard) · Formato DACYTI
          </Text>
        </View>
        <Footer pagina={nextPag()} total={totalPaginas} />
      </Page>

      {/* ────────────────────────────────────────────────────────── FODA */}
      {foda && (
        <Page size="A4" style={s.page}>
          <InstHeader fecha={fecha} />
          <Text style={s.sectionTitle}>ANÁLISIS FODA INSTITUCIONAL</Text>

          <View style={s.fodaGrid}>
            {/* Fortalezas */}
            <View style={[s.fodaCell, { backgroundColor: "#f0fdf4", borderWidth: 1, borderColor: "#86efac" }]}>
              <Text style={[s.fodaLabel, { color: "#15803d" }]}>Fortalezas</Text>
              {foda.fortalezas.map((f) => (
                <Text key={f.id} style={[s.fodaItem, { color: "#166534" }]}>
                  • {f.enunciado}
                </Text>
              ))}
            </View>
            {/* Debilidades */}
            <View style={[s.fodaCell, { backgroundColor: "#fef2f2", borderWidth: 1, borderColor: "#fca5a5" }]}>
              <Text style={[s.fodaLabel, { color: "#dc2626" }]}>Debilidades</Text>
              {foda.debilidades.map((d) => (
                <Text key={d.id} style={[s.fodaItem, { color: "#991b1b" }]}>
                  • {d.enunciado}
                </Text>
              ))}
            </View>
            {/* Oportunidades */}
            <View style={[s.fodaCell, { backgroundColor: "#eff6ff", borderWidth: 1, borderColor: "#93c5fd" }]}>
              <Text style={[s.fodaLabel, { color: "#1d4ed8" }]}>Oportunidades</Text>
              {foda.oportunidades.map((o) => (
                <Text key={o.id} style={[s.fodaItem, { color: "#1e3a8a" }]}>
                  • {o.enunciado}
                </Text>
              ))}
            </View>
            {/* Amenazas */}
            <View style={[s.fodaCell, { backgroundColor: "#fffbeb", borderWidth: 1, borderColor: "#fcd34d" }]}>
              <Text style={[s.fodaLabel, { color: "#b45309" }]}>Amenazas</Text>
              {foda.amenazas.map((a) => (
                <Text key={a.id} style={[s.fodaItem, { color: "#78350f" }]}>
                  • {a.enunciado}
                </Text>
              ))}
            </View>
          </View>

          <Footer pagina={nextPag()} total={totalPaginas} />
        </Page>
      )}

      {/* ─────────────────────────── ANÁLISIS ESTRATÉGICO — LISTA DE ESTRATEGIAS */}
      {analisisEstrategico && (
        <Page size="A4" style={s.page}>
          <InstHeader fecha={fecha} />
          <Text style={s.sectionTitle}>ANÁLISIS ESTRATÉGICO</Text>

          {/* Posicionamiento */}
          <View style={s.posBox}>
            <Text style={s.posLabel}>POSICIONAMIENTO ESTRATÉGICO RECOMENDADO</Text>
            <Text style={s.posText}>{analisisEstrategico.posicionamiento_recomendado}</Text>
          </View>

          <Text style={[s.posLabel, { color: "#374151", marginBottom: 8 }]}>
            Estrategia genérica:{" "}
            <Text style={{ fontFamily: "Helvetica-Bold", color: "#1e3a5f" }}>
              {TIPO_LABELS[analisisEstrategico.estrategia_generica]}
            </Text>
            {"  ·  Resumen ejecutivo: "}
            {analisisEstrategico.resumen_ejecutivo}
          </Text>

          {/* Lista plana de TODAS las estrategias Porter */}
          <Text style={[s.sectionTitle, { fontSize: 9, marginBottom: 6 }]}>
            ESTRATEGIAS IDENTIFICADAS
          </Text>

          {analisisEstrategico.lineas_estrategicas.flatMap((linea) =>
            linea.estrategias.map((est, idx) => {
              const globalIdx =
                analisisEstrategico.lineas_estrategicas
                  .slice(0, analisisEstrategico.lineas_estrategicas.indexOf(linea))
                  .reduce((acc, l) => acc + l.estrategias.length, 0) + idx + 1;
              const prioColor = PRIORIDAD_COLOR[est.prioridad] ?? "#6b7280";
              return (
                <View key={est.id} style={s.estrategiaRow}>
                  <Text style={s.estrategiaNum}>{globalIdx}</Text>
                  <View style={s.estrategiaBody}>
                    <Text style={s.estrategiaTitulo}>{est.nombre}</Text>
                    <Text style={s.estrategiaDescText}>{est.descripcion}</Text>
                    <View style={s.estrategiaMetaRow}>
                      <Text style={s.estrategiaMetaText}>
                        <Text style={s.estrategiaMetaLabel}>Ventaja: </Text>
                        {est.ventaja_distintiva}
                      </Text>
                    </View>
                    <View style={s.estrategiaMetaRow}>
                      <Text style={s.estrategiaMetaText}>
                        <Text style={s.estrategiaMetaLabel}>Indicador: </Text>
                        {est.indicador}
                      </Text>
                      <Text style={s.estrategiaMetaText}>
                        <Text style={s.estrategiaMetaLabel}>Horizonte: </Text>
                        {HORIZONTE_LABEL[est.horizonte] ?? est.horizonte}
                      </Text>
                    </View>
                    <View style={[s.estrategiaBadge, { backgroundColor: prioColor + "22" }]}>
                      <Text style={[s.estrategiaMetaText, { color: prioColor, fontFamily: "Helvetica-Bold" }]}>
                        {est.prioridad}  ·  {TIPO_LABELS[est.tipo] ?? est.tipo}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })
          )}

          {/* Trade-offs y calce al final */}
          {analisisEstrategico.trade_offs_criticos?.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={[s.sectionTitle, { fontSize: 8 }]}>
                TRADE-OFFS CRÍTICOS (Lo que NO haremos)
              </Text>
              {analisisEstrategico.trade_offs_criticos.map((to, i) => (
                <View key={i} style={s.tradeOffBox}>
                  <Text style={s.tradeOffText}>{i + 1}. {to}</Text>
                </View>
              ))}
            </View>
          )}

          <Footer pagina={nextPag()} total={totalPaginas} />
        </Page>
      )}

      {/* ─────────────────────────────────── MATRIZ FODA CRUZADA (2×2 visual) */}
      {matrizFodaCompleta && (
        <Page size="A4" style={s.page}>
          <InstHeader fecha={fecha} />
          <Text style={s.sectionTitle}>MATRIZ FODA CRUZADA — ESTRATEGIAS OPERATIVAS</Text>

          <View style={[s.resumenBox, { marginBottom: 8 }]}>
            <Text style={[s.posLabel, { color: "#374151", marginBottom: 3 }]}>SÍNTESIS EJECUTIVA</Text>
            <Text style={s.resumenText}>{matrizFodaCompleta.sintesis_ejecutiva}</Text>
            <Text style={[s.resumenText, { marginTop: 4, fontFamily: "Helvetica-Bold" }]}>
              Estrategia dominante: {matrizFodaCompleta.estrategia_dominante}
            </Text>
            <Text style={[s.resumenText, { marginTop: 2, color: "#6b7280" }]}>
              Total: {matrizFodaCompleta.total_estrategias} estrategias operativas
            </Text>
          </View>

          <View style={s.matrizGrid}>
            {(["FO", "FA", "DO", "DA"] as const).map((tipo) => {
              const cuadrante = matrizFodaCompleta[tipo];
              const colors = CUADRANTE_COLORS[tipo];
              return (
                <View
                  key={tipo}
                  style={[s.matrizCell, { borderColor: colors.border }]}
                >
                  <View style={[s.matrizCellHeader, { backgroundColor: colors.header }]}>
                    <View>
                      <Text style={s.matrizCellTipo}>{tipo}</Text>
                      <Text style={s.matrizCellTitulo}>{cuadrante.titulo}</Text>
                    </View>
                    <Text style={s.matrizCellCount}>
                      {cuadrante.estrategias.length} est.
                    </Text>
                  </View>
                  <View style={[s.matrizCellBody, { backgroundColor: colors.light }]}>
                    <Text style={[s.matrizItemMeta, { fontStyle: "italic", marginBottom: 4, color: "#4b5563" }]}>
                      {cuadrante.descripcion_logica}
                    </Text>
                    {cuadrante.estrategias.map((est, idx) => (
                      <View key={est.id} style={s.matrizEstrategiaItem}>
                        <Text style={[s.matrizNumero, { color: colors.header }]}>
                          {idx + 1}.
                        </Text>
                        <View style={s.matrizItemBody}>
                          <Text style={s.matrizItemDesc}>{est.descripcion}</Text>
                          <Text style={s.matrizItemMeta}>
                            <Text style={{ fontFamily: "Helvetica-Bold" }}>Indicador: </Text>
                            {est.indicador_exito}
                          </Text>
                          <Text style={s.matrizItemMeta}>
                            <Text style={{ fontFamily: "Helvetica-Bold" }}>Responsable: </Text>
                            {est.responsable_sugerido}
                            {"  ·  "}
                            {HORIZONTE_LABEL[est.horizonte] ?? est.horizonte}
                            {"  · "}
                            <Text style={{ color: PRIORIDAD_COLOR[est.prioridad] }}>
                              {est.prioridad}
                            </Text>
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                </View>
              );
            })}
          </View>

          <Footer pagina={nextPag()} total={totalPaginas} />
        </Page>
      )}

      {/* ────────────────────────────────────────────── ÁRBOL DE PROBLEMAS */}
      {arbolProblemas && (
        <Page size="A3" orientation="landscape" style={s.page}>
          <InstHeader fecha={fecha} />
          <Text style={s.sectionTitle}>ÁRBOL DE PROBLEMAS</Text>

          <Text style={[s.centralLabel, { color: "#7c3aed", marginBottom: 4 }]}>EFECTOS</Text>
          <View style={s.treeRow}>
            {arbolProblemas.efectos.map((e) => (
              <View key={e.id} style={[s.treeNodeBox, { backgroundColor: "#faf5ff", borderColor: "#a855f7" }]}>
                <Text style={[s.treeNodeText, { color: "#6b21a8" }]}>{e.enunciado}</Text>
              </View>
            ))}
          </View>

          <View style={[s.centralBox, { backgroundColor: "#fee2e2", borderColor: "#dc2626" }]}>
            <Text style={[s.centralLabel, { color: "#dc2626" }]}>▶ PROBLEMA CENTRAL</Text>
            <Text style={[s.centralText, { color: "#7f1d1d" }]}>{arbolProblemas.problema_central}</Text>
          </View>

          <Text style={[s.centralLabel, { color: "#c2410c", marginBottom: 4 }]}>CAUSAS</Text>
          <View style={s.treeRow}>
            {arbolProblemas.causas_directas.map((c) => (
              <View key={c.id} style={{ flex: 1 }}>
                <View style={[s.treeNodeBox, { backgroundColor: "#fff7ed", borderColor: "#f97316" }]}>
                  <Text style={[s.treeNodeId, { color: "#c2410c" }]}>{c.id}</Text>
                  <Text style={[s.treeNodeText, { color: "#7c2d12" }]}>{c.enunciado}</Text>
                </View>
                {c.causas_secundarias.map((cs) => (
                  <View key={cs.id} style={[s.treeChildBox, { backgroundColor: "#fefce8", borderColor: "#eab308" }]}>
                    <Text style={[s.treeChildText, { color: "#713f12" }]}>{cs.enunciado}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          <Footer pagina={nextPag()} total={totalPaginas} />
        </Page>
      )}

      {/* ────────────────────────────────────────────────── ANÁLISIS PARETO */}
      {pareto && (
        <Page size="A4" style={s.page}>
          <InstHeader fecha={fecha} />
          <Text style={s.sectionTitle}>PRIORIZACIÓN DE CAUSAS — ANÁLISIS PARETO</Text>

          {/* Tabla header */}
          <View style={[s.paretoRow, { backgroundColor: "#f1f5f9" }]}>
            <Text style={[s.paretoCell, { width: "40%", fontFamily: "Helvetica-Bold" }]}>Causa</Text>
            <Text style={[s.paretoCell, { width: "15%", textAlign: "center", fontFamily: "Helvetica-Bold" }]}>Puntaje</Text>
            <Text style={[s.paretoCell, { width: "20%", textAlign: "center", fontFamily: "Helvetica-Bold" }]}>% Acum.</Text>
            <Text style={[s.paretoCell, { width: "25%", textAlign: "center", fontFamily: "Helvetica-Bold" }]}>Clasificación</Text>
          </View>

          {pareto.causas_priorizadas.map((c) => (
            <View key={c.id} style={s.paretoRow}>
              <Text style={[s.paretoCell, { width: "40%" }]}>{c.enunciado}</Text>
              <Text style={[s.paretoCell, { width: "15%", textAlign: "center" }]}>{c.puntaje_total}</Text>
              <Text style={[s.paretoCell, { width: "20%", textAlign: "center" }]}>
                {c.porcentaje_acumulado?.toFixed(1)}%
              </Text>
              <View style={[s.paretoCell, { width: "25%", alignItems: "center" }]}>
                <View style={[
                  s.paretoBadge,
                  { backgroundColor: c.clasificacion === "CRÍTICA" ? "#fee2e2" : "#f0fdf4" }
                ]}>
                  <Text style={{
                    fontSize: 6,
                    fontFamily: "Helvetica-Bold",
                    color: c.clasificacion === "CRÍTICA" ? "#dc2626" : "#16a34a",
                  }}>
                    {c.clasificacion}
                  </Text>
                </View>
              </View>
            </View>
          ))}

          <Footer pagina={nextPag()} total={totalPaginas} />
        </Page>
      )}

      {/* ────────────────────────────────────────────── AUDITORÍA METODOLÓGICA */}
      {auditoria && (
        <Page size="A4" style={s.page}>
          <InstHeader fecha={fecha} />
          <Text style={s.sectionTitle}>AUDITORÍA METODOLÓGICA — MARCO LÓGICO</Text>

          <View style={[s.auditBadge, {
            backgroundColor: auditoria.calidad_metodologica === "ALTA"
              ? "#16a34a"
              : auditoria.calidad_metodologica === "MEDIA"
              ? "#d97706"
              : "#dc2626",
          }]}>
            <Text style={s.auditBadgeText}>
              Calidad Metodológica: {auditoria.calidad_metodologica}
              {"  "}·{"  "}
              {auditoria.aprobado ? "✓ Aprobado" : "✗ Requiere correcciones"}
            </Text>
          </View>

          <View style={s.auditObsBox}>
            <Text style={s.auditObsText}>{auditoria.observaciones_generales}</Text>
          </View>

          {auditoria.errores.length > 0 && (
            <View>
              <Text style={[s.sectionTitle, { fontSize: 9 }]}>Observaciones del auditor</Text>
              {auditoria.errores.map((e, i) => (
                <View key={i} style={s.auditErrorBox}>
                  <Text style={s.auditErrorNodo}>{e.nodo_id} — {e.tipo_error}</Text>
                  <Text style={s.auditErrorDesc}>{e.descripcion}</Text>
                  <Text style={s.auditErrorSug}>Sugerencia: {e.sugerencia}</Text>
                </View>
              ))}
            </View>
          )}

          <Footer pagina={nextPag()} total={totalPaginas} />
        </Page>
      )}

      {/* ────────────────────────────────────────────── ÁRBOL DE OBJETIVOS */}
      {arbolObjetivos && (
        <Page size="A3" orientation="landscape" style={s.page}>
          <InstHeader fecha={fecha} />
          <Text style={s.sectionTitle}>ÁRBOL DE OBJETIVOS</Text>

          <Text style={[s.centralLabel, { color: "#0c4a6e", marginBottom: 4 }]}>FINES</Text>
          <View style={s.treeRow}>
            {arbolObjetivos.fines.map((f) => (
              <View key={f.id} style={[s.treeNodeBox, { backgroundColor: "#f0f9ff", borderColor: "#0ea5e9" }]}>
                <Text style={[s.treeNodeText, { color: "#0c4a6e" }]}>{f.enunciado}</Text>
              </View>
            ))}
          </View>

          <View style={[s.centralBox, { backgroundColor: "#dcfce7", borderColor: "#16a34a" }]}>
            <Text style={[s.centralLabel, { color: "#16a34a" }]}>▶ OBJETIVO CENTRAL</Text>
            <Text style={[s.centralText, { color: "#14532d" }]}>{arbolObjetivos.objetivo_central}</Text>
          </View>

          <Text style={[s.centralLabel, { color: "#0f766e", marginBottom: 4 }]}>MEDIOS</Text>
          <View style={s.treeRow}>
            {arbolObjetivos.medios_directos.map((m) => (
              <View key={m.id} style={{ flex: 1 }}>
                <View style={[s.treeNodeBox, { backgroundColor: "#f0fdfa", borderColor: "#14b8a6" }]}>
                  <Text style={[s.treeNodeText, { color: "#134e4a" }]}>{m.enunciado}</Text>
                </View>
                {m.medios_especificos.map((me) => (
                  <View key={me.id} style={[s.treeChildBox, { backgroundColor: "#ccfbf1", borderColor: "#5eead4" }]}>
                    <Text style={[s.treeChildText, { color: "#134e4a" }]}>{me.enunciado}</Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          <Footer pagina={nextPag()} total={totalPaginas} />
        </Page>
      )}
    </Document>
  );
}
