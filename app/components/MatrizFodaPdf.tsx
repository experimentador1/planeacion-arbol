"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { FODA, MatrizFodaCruzada, EstrategiaOperativa, CuadranteFODA } from "@/types";

// ─── Paleta de colores por cuadrante ─────────────────────────────────────────
const CUADRANTE_COLOR: Record<string, { bg: string; header: string; badge: string; border: string }> = {
  FO: { bg: "#f0fdf4", header: "#166534", badge: "#dcfce7", border: "#16a34a" },
  FA: { bg: "#eff6ff", header: "#1e3a8a", badge: "#dbeafe", border: "#2563eb" },
  DO: { bg: "#fffbeb", header: "#92400e", badge: "#fef3c7", border: "#d97706" },
  DA: { bg: "#fff1f2", header: "#9f1239", badge: "#ffe4e6", border: "#e11d48" },
};

const PRIORIDAD_COLOR: Record<string, string> = {
  ALTA: "#dc2626",
  MEDIA: "#d97706",
  BAJA: "#16a34a",
};

const HORIZONTE_LABEL: Record<string, string> = {
  INMEDIATO: "Inmediato (0-3 m)",
  CORTO_PLAZO: "Corto plazo (3-12 m)",
  MEDIANO_PLAZO: "Mediano plazo (1-3 a)",
};

// ─── Estilos ──────────────────────────────────────────────────────────────────

const s = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    paddingTop: 22,
    paddingBottom: 30,
    paddingHorizontal: 28,
    fontFamily: "Helvetica",
  },
  // ── Encabezado institucional ──────────────────────────────────────────────
  instHeader: {
    borderBottomWidth: 2,
    borderBottomColor: "#1e3a5f",
    marginBottom: 12,
    paddingBottom: 7,
  },
  instLine1: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    textAlign: "center",
    letterSpacing: 0.5,
  },
  instLine2: {
    fontSize: 7,
    color: "#374151",
    textAlign: "center",
    marginTop: 2,
  },
  instLine3: {
    fontSize: 7,
    color: "#6b7280",
    textAlign: "center",
    marginTop: 1,
    fontStyle: "italic",
  },
  // ── Portada ───────────────────────────────────────────────────────────────
  coverBox: {
    backgroundColor: "#1e3a5f",
    borderRadius: 6,
    padding: 28,
    marginTop: 10,
    marginBottom: 10,
    alignItems: "center",
  },
  coverTitle: {
    fontSize: 20,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    textAlign: "center",
    letterSpacing: 1,
  },
  coverSubtitle: {
    fontSize: 11,
    color: "#93c5fd",
    textAlign: "center",
    marginTop: 6,
  },
  coverBadge: {
    backgroundColor: "#1d4ed8",
    borderRadius: 4,
    paddingVertical: 4,
    paddingHorizontal: 12,
    marginTop: 14,
  },
  coverBadgeText: {
    fontSize: 9,
    color: "#dbeafe",
    textAlign: "center",
    fontFamily: "Helvetica-Bold",
    letterSpacing: 0.5,
  },
  // ── Síntesis ejecutiva ────────────────────────────────────────────────────
  sintesisBox: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    borderRadius: 5,
    padding: 12,
    marginBottom: 10,
  },
  sintesisTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  sintesisText: {
    fontSize: 8.5,
    color: "#374151",
    lineHeight: 1.5,
  },
  // ── FODA insumo ──────────────────────────────────────────────────────────
  fodaGrid: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 12,
  },
  fodaCell: {
    flex: 1,
    borderRadius: 4,
    padding: 8,
    borderWidth: 1,
  },
  fodaCellTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  fodaItem: {
    fontSize: 7,
    color: "#374151",
    marginBottom: 2,
    lineHeight: 1.4,
  },
  // ── Grid matriz 2x2 ──────────────────────────────────────────────────────
  matrizGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  cuadranteCell: {
    width: "48.5%",
    borderRadius: 5,
    borderWidth: 1.5,
    overflow: "hidden",
    marginBottom: 4,
  },
  cuadranteHeader: {
    paddingVertical: 7,
    paddingHorizontal: 10,
  },
  cuadranteHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cuadranteTipo: {
    fontSize: 14,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
  },
  cuadranteTitulo: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#ffffff",
    marginTop: 2,
  },
  cuadranteOrientacion: {
    fontSize: 7.5,
    color: "rgba(255,255,255,0.85)",
    marginTop: 2,
    fontStyle: "italic",
  },
  cuadranteBody: {
    padding: 8,
  },
  logicaText: {
    fontSize: 7.5,
    color: "#4b5563",
    fontStyle: "italic",
    lineHeight: 1.4,
    marginBottom: 6,
    paddingBottom: 5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#d1d5db",
  },
  // ── Tarjeta de estrategia ────────────────────────────────────────────────
  estrategiaCard: {
    borderRadius: 4,
    padding: 7,
    marginBottom: 6,
    borderWidth: 0.5,
    borderColor: "#e5e7eb",
    backgroundColor: "#ffffff",
  },
  estrategiaHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 4,
  },
  estrategiaId: {
    fontSize: 7,
    fontFamily: "Helvetica-Bold",
    color: "#6b7280",
  },
  estrategiaBadgeRow: {
    flexDirection: "row",
    gap: 3,
  },
  badge: {
    borderRadius: 3,
    paddingVertical: 1,
    paddingHorizontal: 4,
  },
  badgeText: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
  },
  estrategiaDesc: {
    fontSize: 8,
    color: "#111827",
    lineHeight: 1.5,
    marginBottom: 5,
  },
  insightBox: {
    backgroundColor: "#f0f9ff",
    borderRadius: 3,
    padding: 4,
    marginBottom: 4,
    borderLeftWidth: 2,
    borderLeftColor: "#0ea5e9",
  },
  insightText: {
    fontSize: 7,
    color: "#0369a1",
    lineHeight: 1.4,
    fontStyle: "italic",
  },
  metaRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
    marginTop: 3,
  },
  metaItem: {
    fontSize: 6.5,
    color: "#6b7280",
  },
  metaLabel: {
    fontFamily: "Helvetica-Bold",
  },
  // ── Acciones prioritarias ────────────────────────────────────────────────
  accionesBox: {
    backgroundColor: "#fef9c3",
    borderWidth: 1,
    borderColor: "#fbbf24",
    borderRadius: 5,
    padding: 10,
    marginTop: 8,
  },
  accionesTitle: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    color: "#92400e",
    marginBottom: 5,
  },
  accionItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 3,
  },
  accionBullet: {
    fontSize: 9,
    color: "#d97706",
    marginRight: 5,
    fontFamily: "Helvetica-Bold",
  },
  accionText: {
    fontSize: 8,
    color: "#374151",
    flex: 1,
    lineHeight: 1.4,
  },
  // ── Pie de página ────────────────────────────────────────────────────────
  pageFooter: {
    position: "absolute",
    bottom: 14,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#d1d5db",
    paddingTop: 4,
  },
  footerText: {
    fontSize: 6.5,
    color: "#9ca3af",
  },
  // ── Título de sección ────────────────────────────────────────────────────
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: "#1e3a5f",
    marginBottom: 8,
    marginTop: 4,
    letterSpacing: 0.3,
  },
});

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function InstHeader() {
  return (
    <View style={s.instHeader}>
      <Text style={s.instLine1}>
        DIVISIÓN ACADÉMICA DE CIENCIAS Y TECNOLOGÍAS DE LA INFORMACIÓN
      </Text>
      <Text style={s.instLine2}>
        INSUMOS PARA EL PLAN DE DESARROLLO 2026 · DOCUMENTO PARA REVISIÓN
      </Text>
      <Text style={s.instLine3}>
        Matriz FODA Cruzada con Estrategias Operativas · Generado con STB v1.0
      </Text>
    </View>
  );
}

function PageFooter({ numero }: { numero: string }) {
  return (
    <View style={s.pageFooter} fixed>
      <Text style={s.footerText}>DACYTI — Plan de Desarrollo 2026</Text>
      <Text style={s.footerText}>Página {numero}</Text>
    </View>
  );
}

function EstrategiaCardView({
  estrategia,
  cuadranteBg,
}: {
  estrategia: EstrategiaOperativa;
  cuadranteBg: string;
}) {
  const prioColor = PRIORIDAD_COLOR[estrategia.prioridad] ?? "#6b7280";
  return (
    <View style={[s.estrategiaCard, { backgroundColor: cuadranteBg }]}>
      <View style={s.estrategiaHeader}>
        <Text style={s.estrategiaId}>{estrategia.id}</Text>
        <View style={s.estrategiaBadgeRow}>
          <View style={[s.badge, { backgroundColor: prioColor + "22" }]}>
            <Text style={[s.badgeText, { color: prioColor }]}>
              {estrategia.prioridad}
            </Text>
          </View>
          <View style={[s.badge, { backgroundColor: "#e0e7ff" }]}>
            <Text style={[s.badgeText, { color: "#4338ca" }]}>
              {HORIZONTE_LABEL[estrategia.horizonte] ?? estrategia.horizonte}
            </Text>
          </View>
        </View>
      </View>

      <Text style={s.estrategiaDesc}>{estrategia.descripcion}</Text>

      {estrategia.insight_porter ? (
        <View style={s.insightBox}>
          <Text style={s.insightText}>🔷 Porter: {estrategia.insight_porter}</Text>
        </View>
      ) : null}

      <View style={s.metaRow}>
        {estrategia.fortalezas_vinculadas?.length > 0 && (
          <Text style={s.metaItem}>
            <Text style={s.metaLabel}>F/D: </Text>
            {estrategia.fortalezas_vinculadas.slice(0, 2).join("; ")}
          </Text>
        )}
        {estrategia.factores_externos_vinculados?.length > 0 && (
          <Text style={s.metaItem}>
            <Text style={s.metaLabel}>O/A: </Text>
            {estrategia.factores_externos_vinculados.slice(0, 2).join("; ")}
          </Text>
        )}
      </View>

      <View style={[s.metaRow, { marginTop: 4 }]}>
        <Text style={s.metaItem}>
          <Text style={s.metaLabel}>Indicador: </Text>
          {estrategia.indicador_exito}
        </Text>
      </View>

      <View style={[s.metaRow, { marginTop: 2 }]}>
        <Text style={s.metaItem}>
          <Text style={s.metaLabel}>Responsable: </Text>
          {estrategia.responsable_sugerido}
        </Text>
      </View>
    </View>
  );
}

function CuadranteView({ cuadrante }: { cuadrante: CuadranteFODA }) {
  const colors = CUADRANTE_COLOR[cuadrante.tipo] ?? CUADRANTE_COLOR.FO;
  return (
    <View style={[s.cuadranteCell, { borderColor: colors.border }]}>
      <View style={[s.cuadranteHeader, { backgroundColor: colors.header }]}>
        <View style={s.cuadranteHeaderRow}>
          <Text style={s.cuadranteTipo}>{cuadrante.tipo}</Text>
          <Text style={[s.estrategiaId, { color: "rgba(255,255,255,0.7)" }]}>
            {cuadrante.estrategias.length} estrategias
          </Text>
        </View>
        <Text style={s.cuadranteTitulo}>{cuadrante.titulo}</Text>
        <Text style={s.cuadranteOrientacion}>{cuadrante.orientacion}</Text>
      </View>

      <View style={[s.cuadranteBody, { backgroundColor: colors.bg }]}>
        <Text style={s.logicaText}>{cuadrante.descripcion_logica}</Text>
        {cuadrante.estrategias.map((est) => (
          <EstrategiaCardView
            key={est.id}
            estrategia={est}
            cuadranteBg="#ffffff"
          />
        ))}
      </View>
    </View>
  );
}

// ─── Componente principal del PDF ─────────────────────────────────────────────

interface MatrizFodaPdfProps {
  foda: FODA;
  matriz: MatrizFodaCruzada;
}

export function MatrizFodaPdf({ foda, matriz }: MatrizFodaPdfProps) {
  return (
    <Document
      title="Matriz FODA Cruzada — DACYTI Plan de Desarrollo 2026"
      author="STB v1.0 — Strategic Advisor (Porter)"
      subject="Estrategias Operativas Institucionales"
    >
      {/* ─── Portada ──────────────────────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <InstHeader />

        <View style={s.coverBox}>
          <Text style={s.coverTitle}>MATRIZ FODA CRUZADA</Text>
          <Text style={s.coverSubtitle}>Estrategias Operativas Institucionales</Text>
          <View style={s.coverBadge}>
            <Text style={s.coverBadgeText}>
              Marco Porter · Harvard Business School · STB v1.0
            </Text>
          </View>
        </View>

        {/* Síntesis ejecutiva */}
        <View style={s.sintesisBox}>
          <Text style={s.sintesisTitle}>SÍNTESIS EJECUTIVA</Text>
          <Text style={s.sintesisText}>{matriz.sintesis_ejecutiva}</Text>
          <Text style={[s.sintesisText, { marginTop: 6, fontFamily: "Helvetica-Bold" }]}>
            Estrategia dominante: {matriz.estrategia_dominante}
          </Text>
        </View>

        {/* Insumo FODA resumido */}
        <Text style={s.sectionTitle}>INSUMO: ANÁLISIS FODA INSTITUCIONAL</Text>
        <View style={s.fodaGrid}>
          <View style={[s.fodaCell, { backgroundColor: "#f0fdf4", borderColor: "#16a34a" }]}>
            <Text style={[s.fodaCellTitle, { color: "#166534" }]}>
              FORTALEZAS ({foda.fortalezas.length})
            </Text>
            {foda.fortalezas.slice(0, 5).map((f, i) => (
              <Text key={i} style={s.fodaItem}>• {f.enunciado}</Text>
            ))}
            {foda.fortalezas.length > 5 && (
              <Text style={[s.fodaItem, { color: "#9ca3af" }]}>
                + {foda.fortalezas.length - 5} más…
              </Text>
            )}
          </View>
          <View style={[s.fodaCell, { backgroundColor: "#eff6ff", borderColor: "#2563eb" }]}>
            <Text style={[s.fodaCellTitle, { color: "#1e40af" }]}>
              OPORTUNIDADES ({foda.oportunidades.length})
            </Text>
            {foda.oportunidades.slice(0, 5).map((o, i) => (
              <Text key={i} style={s.fodaItem}>• {o.enunciado}</Text>
            ))}
            {foda.oportunidades.length > 5 && (
              <Text style={[s.fodaItem, { color: "#9ca3af" }]}>
                + {foda.oportunidades.length - 5} más…
              </Text>
            )}
          </View>
          <View style={[s.fodaCell, { backgroundColor: "#fffbeb", borderColor: "#d97706" }]}>
            <Text style={[s.fodaCellTitle, { color: "#92400e" }]}>
              DEBILIDADES ({foda.debilidades.length})
            </Text>
            {foda.debilidades.slice(0, 5).map((d, i) => (
              <Text key={i} style={s.fodaItem}>• {d.enunciado}</Text>
            ))}
            {foda.debilidades.length > 5 && (
              <Text style={[s.fodaItem, { color: "#9ca3af" }]}>
                + {foda.debilidades.length - 5} más…
              </Text>
            )}
          </View>
          <View style={[s.fodaCell, { backgroundColor: "#fff1f2", borderColor: "#e11d48" }]}>
            <Text style={[s.fodaCellTitle, { color: "#9f1239" }]}>
              AMENAZAS ({foda.amenazas.length})
            </Text>
            {foda.amenazas.slice(0, 5).map((a, i) => (
              <Text key={i} style={s.fodaItem}>• {a.enunciado}</Text>
            ))}
            {foda.amenazas.length > 5 && (
              <Text style={[s.fodaItem, { color: "#9ca3af" }]}>
                + {foda.amenazas.length - 5} más…
              </Text>
            )}
          </View>
        </View>

        {/* Acciones prioritarias */}
        <View style={s.accionesBox}>
          <Text style={s.accionesTitle}>ACCIONES PRIORITARIAS DERIVADAS</Text>
          {matriz.acciones_prioritarias.map((acc, i) => (
            <View key={i} style={s.accionItem}>
              <Text style={s.accionBullet}>{i + 1}.</Text>
              <Text style={s.accionText}>{acc}</Text>
            </View>
          ))}
        </View>

        <PageFooter numero="1" />
      </Page>

      {/* ─── Cuadrantes FO y FA ───────────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <InstHeader />

        <Text style={s.sectionTitle}>
          MATRIZ FODA CRUZADA — ESTRATEGIAS OFENSIVAS Y DEFENSIVAS
        </Text>

        <View style={s.matrizGrid}>
          <CuadranteView cuadrante={matriz.FO} />
          <CuadranteView cuadrante={matriz.FA} />
        </View>

        <PageFooter numero="2" />
      </Page>

      {/* ─── Cuadrantes DO y DA ───────────────────────────────────────────── */}
      <Page size="A4" style={s.page}>
        <InstHeader />

        <Text style={s.sectionTitle}>
          MATRIZ FODA CRUZADA — ESTRATEGIAS DE REORIENTACIÓN Y SUPERVIVENCIA
        </Text>

        <View style={s.matrizGrid}>
          <CuadranteView cuadrante={matriz.DO} />
          <CuadranteView cuadrante={matriz.DA} />
        </View>

        <PageFooter numero="3" />
      </Page>
    </Document>
  );
}
