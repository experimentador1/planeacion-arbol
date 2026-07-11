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
  IntensidadFuerza,
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

const INTENSIDAD_BG: Record<IntensidadFuerza, string> = {
  ALTA: "#dc2626",
  MEDIA: "#d97706",
  BAJA: "#16a34a",
};

const TIPO_LABELS: Record<TipoEstrategiaPorter, string> = {
  DIFERENCIACION: "Diferenciación",
  EFICIENCIA_INSTITUCIONAL: "Eficiencia Institucional",
  ENFOQUE: "Enfoque",
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
  arbolProblemas: ArbolProblemas | null;
  pareto: AnalisisPareto | null;
  auditoria: ResultadoAuditoria | null;
  arbolObjetivos: ArbolObjetivos | null;
}

// ─── Documento ────────────────────────────────────────────────────────────────

export function ReportePdf({
  foda,
  analisisEstrategico,
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
    (analisisEstrategico ? 2 : 0) + // 5 fuerzas + líneas estratégicas
    (arbolProblemas ? 1 : 0) +
    (pareto ? 1 : 0) +
    (auditoria ? 1 : 0) +
    (arbolObjetivos ? 1 : 0);

  const nextPag = () => {
    paginaActual += 1;
    return paginaActual;
  };

  const FUERZAS_LABELS: Record<string, string> = {
    rivalidad_institucional: "Rivalidad institucional",
    poder_financiadores: "Poder de financiadores/autoridades",
    amenaza_nuevos_actores: "Amenaza de nuevos actores",
    poder_proveedores: "Poder de proveedores/aliados",
    presion_sustitutos: "Presión de sustitutos",
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

      {/* ────────────────────────────────────── ANÁLISIS PORTER — 5 FUERZAS */}
      {analisisEstrategico && (
        <Page size="A4" style={s.page}>
          <InstHeader fecha={fecha} />
          <Text style={s.sectionTitle}>ANÁLISIS ESTRATÉGICO — 5 FUERZAS COMPETITIVAS (PORTER)</Text>

          <View style={s.posBox}>
            <Text style={s.posLabel}>Posicionamiento estratégico recomendado</Text>
            <Text style={s.posText}>{analisisEstrategico.posicionamiento_recomendado}</Text>
          </View>

          <Text style={[s.posLabel, { color: "#374151", marginBottom: 6 }]}>
            Estrategia genérica: {TIPO_LABELS[analisisEstrategico.estrategia_generica]}
          </Text>

          {Object.entries(FUERZAS_LABELS).map(([key, label]) => {
            const f = analisisEstrategico.cinco_fuerzas[
              key as keyof typeof analisisEstrategico.cinco_fuerzas
            ];
            if (!f || typeof f === "string") return null;
            const fuerza = f as { intensidad: IntensidadFuerza; descripcion: string; implicacion_estrategica: string };
            return (
              <View key={key} style={[s.fuerzaRow, { borderColor: "#e5e7eb" }]}>
                <View style={[s.fuerzaBadge, { backgroundColor: INTENSIDAD_BG[fuerza.intensidad] }]}>
                  <Text style={s.fuerzaBadgeText}>{fuerza.intensidad}</Text>
                </View>
                <View style={s.fuerzaContent}>
                  <Text style={s.fuerzaNombre}>{label}</Text>
                  <Text style={s.fuerzaDesc}>{fuerza.descripcion}</Text>
                  <Text style={s.fuerzaImpl}>→ {fuerza.implicacion_estrategica}</Text>
                </View>
              </View>
            );
          })}

          <View style={s.resumenBox}>
            <Text style={[s.posLabel, { color: "#374151", marginBottom: 4 }]}>Resumen del entorno</Text>
            <Text style={s.resumenText}>{analisisEstrategico.cinco_fuerzas.resumen}</Text>
          </View>

          <Footer pagina={nextPag()} total={totalPaginas} />
        </Page>
      )}

      {/* ────────────────────────────────── LÍNEAS ESTRATÉGICAS + TRADE-OFFS */}
      {analisisEstrategico && (
        <Page size="A4" style={s.page}>
          <InstHeader fecha={fecha} />
          <Text style={s.sectionTitle}>LÍNEAS ESTRATÉGICAS</Text>

          <View style={s.resumenBox}>
            <Text style={s.resumenText}>{analisisEstrategico.resumen_ejecutivo}</Text>
          </View>

          {analisisEstrategico.lineas_estrategicas.map((linea) => (
            <View key={linea.id} style={{ marginBottom: 10 }}>
              <Text style={[s.estrategiaNombre, { fontSize: 9, color: "#1e3a5f", marginBottom: 4 }]}>
                {linea.id} — {linea.nombre}
              </Text>
              {linea.estrategias.map((est) => (
                <View key={est.id} style={s.estrategiaCard}>
                  <Text style={s.estrategiaNombre}>{est.nombre}</Text>
                  <Text style={s.estrategiaDesc}>{est.descripcion}</Text>
                  <Text style={s.estrategiaField}>
                    <Text style={s.estrategiaFieldLabel}>Ventaja: </Text>
                    {est.ventaja_distintiva}
                  </Text>
                  <View style={s.tradeOffBox}>
                    <Text style={s.tradeOffText}>Trade-off: {est.trade_off}</Text>
                  </View>
                  <Text style={[s.estrategiaField, { color: "#6b7280" }]}>
                    Indicador: {est.indicador}
                  </Text>
                </View>
              ))}
            </View>
          ))}

          {analisisEstrategico.trade_offs_criticos?.length > 0 && (
            <View>
              <Text style={[s.sectionTitle, { fontSize: 9, marginTop: 6 }]}>
                TRADE-OFFS CRÍTICOS (Lo que NO haremos)
              </Text>
              {analisisEstrategico.trade_offs_criticos.map((to, i) => (
                <View key={i} style={s.tradeOffBox}>
                  <Text style={s.tradeOffText}>{i + 1}. {to}</Text>
                </View>
              ))}
            </View>
          )}

          {analisisEstrategico.calce_actividades?.length > 0 && (
            <View style={{ marginTop: 6 }}>
              <Text style={[s.sectionTitle, { fontSize: 9 }]}>CALCE DE ACTIVIDADES</Text>
              {analisisEstrategico.calce_actividades.map((c, i) => (
                <View key={i} style={s.calceBox}>
                  <Text style={s.calceText}>{c}</Text>
                </View>
              ))}
            </View>
          )}

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
