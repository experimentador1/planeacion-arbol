import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Line,
  Svg,
} from "@react-pdf/renderer";

// ─── Paleta de colores ────────────────────────────────────────────────────────
const C = {
  azulOscuro: "#1e3a5f",
  azulMedio: "#2563eb",
  azulClaro: "#dbeafe",
  grisOscuro: "#1f2937",
  grisMedio: "#6b7280",
  grisClaro: "#f3f4f6",
  blanco: "#ffffff",
  verde: "#15803d",
  verdeClaro: "#dcfce7",
  rojo: "#dc2626",
  rojoClaro: "#fee2e2",
  naranja: "#c2410c",
  naranjaClaro: "#fff7ed",
  morado: "#7c3aed",
  moradoClaro: "#f5f3ff",
  amarillo: "#b45309",
  amarilloClaro: "#fef9c3",
  teal: "#0f766e",
  tealClaro: "#f0fdfa",
  slate: "#334155",
} as const;

const styles = StyleSheet.create({
  // Página
  page: { backgroundColor: C.blanco, padding: 0 },

  // Header general
  pageHeader: {
    backgroundColor: C.azulOscuro,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  pageHeaderTitle: {
    color: C.blanco,
    fontSize: 16,
    fontFamily: "Helvetica-Bold",
    letterSpacing: 1,
  },
  pageHeaderSub: {
    color: "#93c5fd",
    fontSize: 9,
    marginTop: 3,
    fontFamily: "Helvetica",
  },

  // Contenido con padding
  body: { paddingHorizontal: 28, paddingVertical: 18 },

  // ── Sección ──
  sectionTitle: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.azulOscuro,
    marginBottom: 8,
    textTransform: "uppercase",
    letterSpacing: 1,
  },

  // ── Cajas de agentes ──
  agentRow: {
    flexDirection: "row",
    alignItems: "stretch",
    marginBottom: 6,
    gap: 0,
  },
  agentBadge: {
    width: 28,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 6,
  },
  agentBadgeText: {
    color: C.blanco,
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    textAlign: "center",
  },
  agentBox: {
    flex: 1,
    borderRadius: 4,
    paddingHorizontal: 10,
    paddingVertical: 7,
    marginLeft: 4,
    borderWidth: 1,
  },
  agentName: {
    fontSize: 9,
    fontFamily: "Helvetica-Bold",
    marginBottom: 2,
  },
  agentDesc: {
    fontSize: 7.5,
    fontFamily: "Helvetica",
    color: C.grisMedio,
    marginBottom: 3,
  },
  agentIORow: {
    flexDirection: "row",
    gap: 6,
    marginTop: 2,
  },
  agentIOBox: {
    flex: 1,
    borderRadius: 3,
    padding: 4,
    borderWidth: 0.5,
    borderStyle: "dashed",
  },
  agentIOLabel: {
    fontSize: 6.5,
    fontFamily: "Helvetica-Bold",
    textTransform: "uppercase",
    marginBottom: 1.5,
  },
  agentIOText: {
    fontSize: 6.5,
    fontFamily: "Helvetica",
    color: C.grisOscuro,
    lineHeight: 1.4,
  },

  // ── Validación humana ──
  validationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fefce8",
    borderColor: "#f59e0b",
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginVertical: 5,
    gap: 6,
  },
  validationIcon: {
    fontSize: 12,
  },
  validationText: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: "#92400e",
    flex: 1,
  },
  validationSub: {
    fontSize: 7,
    fontFamily: "Helvetica",
    color: "#a16207",
    flex: 2,
  },

  // ── Flecha / conector ──
  arrowRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginVertical: 2,
  },
  arrowText: {
    fontSize: 10,
    color: C.grisMedio,
  },

  // ── Fila de entrada ──
  inputRow: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 10,
  },
  inputBox: {
    flex: 1,
    backgroundColor: C.grisClaro,
    borderRadius: 5,
    borderColor: "#d1d5db",
    borderWidth: 1,
    padding: 8,
    alignItems: "center",
  },
  inputBoxEmoji: {
    fontSize: 14,
    marginBottom: 3,
  },
  inputBoxTitle: {
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
    color: C.grisOscuro,
    textAlign: "center",
  },
  inputBoxSub: {
    fontSize: 6.5,
    fontFamily: "Helvetica",
    color: C.grisMedio,
    textAlign: "center",
    marginTop: 1,
  },

  // ── Conductor ──
  conductorBox: {
    backgroundColor: C.azulOscuro,
    borderRadius: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    gap: 10,
  },
  conductorLabel: {
    color: C.blanco,
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    flex: 1,
  },
  conductorSub: {
    color: "#93c5fd",
    fontSize: 7.5,
    fontFamily: "Helvetica",
    flex: 2,
  },

  // ── Output final ──
  outputBox: {
    backgroundColor: C.verdeClaro,
    borderColor: C.verde,
    borderWidth: 2,
    borderRadius: 6,
    padding: 10,
    marginTop: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  outputLabel: {
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
    color: C.verde,
    flex: 1,
  },
  outputSub: {
    fontSize: 7.5,
    fontFamily: "Helvetica",
    color: "#166534",
    flex: 2,
  },

  // ── Segunda página ──
  tableHeader: {
    flexDirection: "row",
    backgroundColor: C.azulOscuro,
    padding: 6,
    borderRadius: 3,
    marginBottom: 2,
  },
  tableHeaderCell: {
    color: C.blanco,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 5,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: "#e5e7eb",
  },
  tableCell: {
    fontSize: 7.5,
    fontFamily: "Helvetica",
    color: C.grisOscuro,
    lineHeight: 1.4,
  },
  tableCellBold: {
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
    color: C.grisOscuro,
  },

  // ── Leyenda ──
  legendRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 6,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  legendText: {
    fontSize: 7,
    fontFamily: "Helvetica",
    color: C.grisMedio,
  },

  // Footer
  footer: {
    position: "absolute",
    bottom: 16,
    left: 28,
    right: 28,
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 0.5,
    borderTopColor: "#e5e7eb",
    paddingTop: 6,
  },
  footerText: {
    fontSize: 6.5,
    fontFamily: "Helvetica",
    color: C.grisMedio,
  },
});

// ─── Datos de agentes ─────────────────────────────────────────────────────────
const AGENTES = [
  {
    num: "1",
    nombre: "Librarian Agent",
    color: C.azulMedio,
    bgColor: C.azulClaro,
    borderColor: "#93c5fd",
    desc: "Ingesta, limpieza y vectorización de documentos institucionales",
    input: "Archivos PDF / DOCX cargados por el analista",
    output: "Array de Hallazgos clasificados {tipo, enunciado, fuente, página}",
    modelo: "GPT-4o + text-embedding-3-small",
    valida: false,
  },
  {
    num: "2",
    nombre: "FODA Agent",
    color: C.teal,
    bgColor: C.tealClaro,
    borderColor: "#5eead4",
    desc: "Clasifica hallazgos en matriz FODA estratégica institucional",
    input: "Array de hallazgos del Librarian Agent",
    output: "FODA con 4 cuadrantes + debilidades_prioritarias[]",
    modelo: "GPT-4o",
    valida: true,
    validaLabel: "Validación Humana 1",
    validaDesc: "Analista edita, agrega o elimina elementos del FODA antes de continuar",
  },
  {
    num: "3",
    nombre: "Problem Architect",
    color: "#7c3aed",
    bgColor: C.moradoClaro,
    borderColor: "#c4b5fd",
    desc: "Identifica y propone 3 candidatos rankeados al Problema Central",
    input: "FODA validado + debilidades prioritarias",
    output: "3 candidatos {ranking, peso_sistémico, causas, efectos, evidencia}",
    modelo: "GPT-4o",
    valida: true,
    validaLabel: "Validación Humana 2",
    validaDesc: "Analista selecciona un candidato o escribe su propio Problema Central",
  },
  {
    num: "4",
    nombre: "Causal Designer",
    color: C.naranja,
    bgColor: C.naranjaClaro,
    borderColor: "#fed7aa",
    desc: "Construye el árbol de causas (directas + secundarias) y efectos via RAG",
    input: "Problema Central confirmado + hallazgos contextuales",
    output: "ArbolProblemas {problema_central, efectos[], causas_directas[]}",
    modelo: "GPT-4o",
    valida: false,
  },
  {
    num: "5",
    nombre: "Pareto Filter",
    color: C.amarillo,
    bgColor: C.amarilloClaro,
    borderColor: "#fde047",
    desc: "Calcula peso estratégico de cada causa aplicando Principio 80/20",
    input: "Árbol de problemas (causas directas)",
    output: "AnalisisPareto {puntaje, % acumulado, clasificación CRÍTICA/SECUNDARIA}",
    modelo: "GPT-4o",
    valida: false,
  },
  {
    num: "6",
    nombre: "Methodological Auditor",
    color: C.rojo,
    bgColor: C.rojoClaro,
    borderColor: "#fca5a5",
    desc: "Verifica que el árbol cumple criterios de Marco Lógico y DACYTI",
    input: "Árbol de problemas completo (enriquecido con Pareto)",
    output: "ResultadoAuditoria {aprobado, errores[], calidad ALTA/MEDIA/BAJA}",
    modelo: "GPT-4o",
    valida: true,
    validaLabel: "Validación Humana 3",
    validaDesc: "Analista revisa semáforo de calidad y errores antes de exportar",
  },
  {
    num: "7",
    nombre: "Format Painter",
    color: C.verde,
    bgColor: C.verdeClaro,
    borderColor: "#86efac",
    desc: "Espeja el árbol de problemas en positivo y genera el Árbol de Objetivos",
    input: "Árbol de problemas auditado y aprobado",
    output: "ArbolObjetivos {objetivo_central, fines[], medios_directos[]}",
    modelo: "GPT-4o",
    valida: false,
  },
];

// ─── Componente principal ─────────────────────────────────────────────────────
export function ArquitecturaDiagram() {
  const fecha = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document
      title="STB v1.0 — Arquitectura del Sistema Multiagente"
      author="Strategic Tree Builder"
      subject="Diagrama de flujo de agentes IA"
    >
      {/* ══════════════════════════════════════════════════════════════════════
          PÁGINA 1 — Flujo Visual del Sistema
      ══════════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeaderTitle}>
            STRATEGIC TREE BUILDER v1.0 — ARQUITECTURA DEL SISTEMA
          </Text>
          <Text style={styles.pageHeaderSub}>
            Sistema Multiagente Orquestado · Marco Lógico · Formato DACYTI · {fecha}
          </Text>
        </View>

        <View style={styles.body}>
          {/* ── INPUT ───────────────────────────────────────── */}
          <Text style={styles.sectionTitle}>Entrada del Sistema</Text>
          <View style={styles.inputRow}>
            <View style={styles.inputBox}>
              <Text style={styles.inputBoxEmoji}>📄</Text>
              <Text style={styles.inputBoxTitle}>Documentos PDF</Text>
              <Text style={styles.inputBoxSub}>Planes, informes, evaluaciones</Text>
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.inputBoxEmoji}>📝</Text>
              <Text style={styles.inputBoxTitle}>Documentos DOCX</Text>
              <Text style={styles.inputBoxSub}>Reportes, diagnósticos</Text>
            </View>
            <View style={styles.inputBox}>
              <Text style={styles.inputBoxEmoji}>👤</Text>
              <Text style={styles.inputBoxTitle}>Analista</Text>
              <Text style={styles.inputBoxSub}>Drag & drop · máx. 20 MB</Text>
            </View>
          </View>

          {/* ── CONDUCTOR ───────────────────────────────────── */}
          <View style={styles.arrowRow}><Text style={styles.arrowText}>↓</Text></View>
          <View style={styles.conductorBox}>
            <Text style={styles.conductorLabel}>⚙ CONDUCTOR (Orquestador)</Text>
            <Text style={styles.conductorSub}>
              lib/conductor.ts · Coordina secuencia de agentes · Gestiona puntos de validación humana · Estado Zustand en memoria de sesión
            </Text>
          </View>
          <View style={styles.arrowRow}><Text style={styles.arrowText}>↓</Text></View>

          {/* ── AGENTES ─────────────────────────────────────── */}
          <Text style={[styles.sectionTitle, { marginTop: 4 }]}>Pipeline de Agentes</Text>

          {AGENTES.map((ag) => (
            <View key={ag.num}>
              {/* Caja del agente */}
              <View style={styles.agentRow}>
                <View style={[styles.agentBadge, { backgroundColor: ag.color }]}>
                  <Text style={styles.agentBadgeText}>#{ag.num}</Text>
                </View>
                <View style={[styles.agentBox, { backgroundColor: ag.bgColor, borderColor: ag.borderColor }]}>
                  <Text style={[styles.agentName, { color: ag.color }]}>{ag.nombre}</Text>
                  <Text style={styles.agentDesc}>{ag.desc}</Text>
                  <View style={styles.agentIORow}>
                    <View style={[styles.agentIOBox, { backgroundColor: "#f8fafc", borderColor: "#cbd5e1" }]}>
                      <Text style={[styles.agentIOLabel, { color: "#475569" }]}>INPUT</Text>
                      <Text style={styles.agentIOText}>{ag.input}</Text>
                    </View>
                    <View style={[styles.agentIOBox, { backgroundColor: "#f0fdf4", borderColor: "#86efac" }]}>
                      <Text style={[styles.agentIOLabel, { color: C.verde }]}>OUTPUT</Text>
                      <Text style={styles.agentIOText}>{ag.output}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Punto de validación humana */}
              {ag.valida && ag.validaLabel && (
                <>
                  <View style={styles.arrowRow}><Text style={styles.arrowText}>↓</Text></View>
                  <View style={styles.validationBox}>
                    <Text style={styles.validationIcon}>🛑</Text>
                    <Text style={styles.validationText}>{ag.validaLabel}</Text>
                    <Text style={styles.validationSub}>{ag.validaDesc}</Text>
                  </View>
                  <View style={styles.arrowRow}><Text style={styles.arrowText}>↓</Text></View>
                </>
              )}

              {/* Flecha entre agentes normales */}
              {!ag.valida && ag.num !== "7" && (
                <View style={styles.arrowRow}><Text style={styles.arrowText}>↓</Text></View>
              )}
            </View>
          ))}

          {/* ── OUTPUT FINAL ─────────────────────────────────── */}
          <View style={styles.arrowRow}><Text style={styles.arrowText}>↓</Text></View>
          <View style={styles.outputBox}>
            <Text style={styles.outputLabel}>📥 PRODUCTO FINAL</Text>
            <Text style={styles.outputSub}>
              PDF DACYTI · 2 láminas · Árbol de Problemas + Árbol de Objetivos · Formato oficial institucional
            </Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Strategic Tree Builder v1.0 — DACYTI</Text>
          <Text style={styles.footerText}>Página 1 de 2</Text>
          <Text style={styles.footerText}>{fecha}</Text>
        </View>
      </Page>

      {/* ══════════════════════════════════════════════════════════════════════
          PÁGINA 2 — Tabla técnica + Estado de sesión + Leyenda
      ══════════════════════════════════════════════════════════════════════ */}
      <Page size="A4" style={styles.page}>
        <View style={styles.pageHeader}>
          <Text style={styles.pageHeaderTitle}>
            STB v1.0 — ESPECIFICACIÓN TÉCNICA DE AGENTES
          </Text>
          <Text style={styles.pageHeaderSub}>
            API Routes · Prompts · Modelos · Tipos de salida · {fecha}
          </Text>
        </View>

        <View style={styles.body}>
          {/* ── TABLA DE AGENTES ─────────────────────────────── */}
          <Text style={styles.sectionTitle}>Tabla de Especificación por Agente</Text>

          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.tableHeaderCell, { flex: 0.4 }]}>#</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.4 }]}>Agente</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1.2 }]}>API Route</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.8 }]}>Modelo</Text>
            <Text style={[styles.tableHeaderCell, { flex: 1 }]}>Tipo de Salida</Text>
            <Text style={[styles.tableHeaderCell, { flex: 0.6 }]}>Temp.</Text>
          </View>

          {[
            { num: "1", nombre: "Librarian Agent", route: "/api/upload", modelo: "GPT-4o", salida: "Hallazgo[]", temp: "0.1" },
            { num: "2", nombre: "FODA Agent", route: "/api/foda", modelo: "GPT-4o", salida: "ResultadoFODA", temp: "0.2" },
            { num: "3", nombre: "Problem Architect", route: "/api/problem", modelo: "GPT-4o", salida: "CandidatoProblema[]", temp: "0.2" },
            { num: "4", nombre: "Causal Designer", route: "/api/causal", modelo: "GPT-4o", salida: "ArbolProblemas", temp: "0.2" },
            { num: "5", nombre: "Pareto Filter", route: "/api/pareto", modelo: "GPT-4o", salida: "AnalisisPareto", temp: "0.1" },
            { num: "6", nombre: "Methodological Auditor", route: "/api/audit", modelo: "GPT-4o", salida: "ResultadoAuditoria", temp: "0.1" },
            { num: "7", nombre: "Format Painter", route: "/api/export", modelo: "GPT-4o", salida: "ArbolObjetivos", temp: "0.3" },
          ].map((row, i) => (
            <View key={row.num} style={[styles.tableRow, { backgroundColor: i % 2 === 0 ? "#f9fafb" : C.blanco }]}>
              <Text style={[styles.tableCellBold, { flex: 0.4 }]}>{row.num}</Text>
              <Text style={[styles.tableCellBold, { flex: 1.4 }]}>{row.nombre}</Text>
              <Text style={[styles.tableCell, { flex: 1.2, color: C.azulMedio }]}>{row.route}</Text>
              <Text style={[styles.tableCell, { flex: 0.8 }]}>{row.modelo}</Text>
              <Text style={[styles.tableCell, { flex: 1, color: C.teal }]}>{row.salida}</Text>
              <Text style={[styles.tableCell, { flex: 0.6, textAlign: "center" }]}>{row.temp}</Text>
            </View>
          ))}

          {/* ── ESTADO ZUSTAND ───────────────────────────────── */}
          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Estado de Sesión (Zustand — Sin Base de Datos)</Text>

          <View style={{ flexDirection: "row", gap: 8 }}>
            {[
              {
                titulo: "Datos de Entrada",
                color: C.azulMedio,
                items: ["documentos: Documento[]", "hallazgos: Hallazgo[]"],
              },
              {
                titulo: "Análisis Estratégico",
                color: C.teal,
                items: ["foda: FODA | null", "candidatos_problema[]", "problema_central: string"],
              },
              {
                titulo: "Árboles Generados",
                color: C.naranja,
                items: ["arbol_problemas: ArbolProblemas", "pareto: AnalisisPareto", "auditoria: ResultadoAuditoria"],
              },
              {
                titulo: "Producto Final",
                color: C.verde,
                items: ["arbol_objetivos: ArbolObjetivos", "paso_actual: PasoFlujo", "agentes: AgentStatus"],
              },
            ].map((col) => (
              <View
                key={col.titulo}
                style={{
                  flex: 1,
                  backgroundColor: "#f8fafc",
                  borderRadius: 5,
                  borderLeftWidth: 3,
                  borderLeftColor: col.color,
                  padding: 7,
                }}
              >
                <Text style={{ fontSize: 7.5, fontFamily: "Helvetica-Bold", color: col.color, marginBottom: 4 }}>
                  {col.titulo}
                </Text>
                {col.items.map((item) => (
                  <Text key={item} style={{ fontSize: 6.5, fontFamily: "Helvetica", color: C.grisOscuro, marginBottom: 1.5 }}>
                    · {item}
                  </Text>
                ))}
              </View>
            ))}
          </View>

          {/* ── FLUJO DE PANTALLAS ──────────────────────────── */}
          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Flujo de Pantallas (UX)</Text>

          <View style={{ flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 4 }}>
            {[
              { label: "1. Carga\nDocumentos", color: C.azulMedio },
              { label: "→", color: C.grisMedio },
              { label: "2. Validar\nFODA", color: C.teal },
              { label: "→", color: C.grisMedio },
              { label: "3. Seleccionar\nProblema", color: C.morado },
              { label: "→", color: C.grisMedio },
              { label: "4. Árbol de\nProblemas", color: C.naranja },
              { label: "→", color: C.grisMedio },
              { label: "5. Auditoría\nMetodológica", color: C.rojo },
              { label: "→", color: C.grisMedio },
              { label: "6. Árbol de\nObjetivos", color: C.verde },
              { label: "→", color: C.grisMedio },
              { label: "7. Exportar\nPDF DACYTI", color: "#065f46" },
            ].map((step, i) =>
              step.label === "→" ? (
                <Text key={i} style={{ fontSize: 12, color: step.color }}>→</Text>
              ) : (
                <View
                  key={i}
                  style={{
                    backgroundColor: step.color,
                    borderRadius: 4,
                    padding: 5,
                    minWidth: 52,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 6.5, fontFamily: "Helvetica-Bold", color: C.blanco, textAlign: "center" }}>
                    {step.label}
                  </Text>
                </View>
              )
            )}
          </View>

          {/* ── VARIABLES DE ENTORNO ────────────────────────── */}
          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Variables de Entorno Requeridas</Text>

          <View style={{ backgroundColor: "#0f172a", borderRadius: 5, padding: 10, gap: 3 }}>
            {[
              { key: "OPENAI_API_KEY", val: "sk-proj-...", desc: "Llave de la API de OpenAI (requerida)" },
              { key: "OPENAI_MODEL", val: "gpt-4o", desc: "Modelo LLM para los 7 agentes" },
              { key: "OPENAI_EMBEDDING_MODEL", val: "text-embedding-3-small", desc: "Modelo de embeddings para vectorización" },
            ].map((env) => (
              <View key={env.key} style={{ flexDirection: "row", gap: 6, alignItems: "flex-start" }}>
                <Text style={{ fontSize: 7, fontFamily: "Helvetica-Bold", color: "#7dd3fc", minWidth: 90 }}>
                  {env.key}
                </Text>
                <Text style={{ fontSize: 7, fontFamily: "Helvetica", color: "#86efac", minWidth: 70 }}>
                  {env.val}
                </Text>
                <Text style={{ fontSize: 7, fontFamily: "Helvetica", color: "#94a3b8", flex: 1 }}>
                  # {env.desc}
                </Text>
              </View>
            ))}
          </View>

          {/* ── LEYENDA ─────────────────────────────────────── */}
          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Leyenda</Text>
          <View style={styles.legendRow}>
            {[
              { color: C.azulMedio, label: "Agente de ingesta documental" },
              { color: C.teal, label: "Agente de clasificación FODA" },
              { color: "#7c3aed", label: "Agente de identificación de problema" },
              { color: C.naranja, label: "Agente de análisis causal" },
              { color: C.amarillo, label: "Agente de priorización Pareto" },
              { color: C.rojo, label: "Agente auditor metodológico" },
              { color: C.verde, label: "Agente de espejado y exportación" },
              { color: "#f59e0b", label: "Punto de validación humana obligatorio" },
            ].map((item) => (
              <View key={item.label} style={styles.legendItem}>
                <View style={[styles.legendDot, { backgroundColor: item.color }]} />
                <Text style={styles.legendText}>{item.label}</Text>
              </View>
            ))}
          </View>

          {/* ── CRITERIOS DE ACEPTACIÓN ─────────────────────── */}
          <Text style={[styles.sectionTitle, { marginTop: 18 }]}>Criterios de Aceptación (PDD v1.0)</Text>
          <View style={{ gap: 2 }}>
            {[
              ["CA-01", "Ingesta documental", "Procesa PDF y DOCX sin errores"],
              ["CA-02", "Extracción de hallazgos", "Mínimo 10 hallazgos por documento de 20 páginas"],
              ["CA-03", "FODA generado", "4 cuadrantes con mínimo 3 elementos cada uno"],
              ["CA-04", "Problema Central", "3 candidatos con justificación y evidencia"],
              ["CA-05", "Árbol de Problemas", "≥2 causas directas, ≥2 secundarias por causa, ≥2 efectos"],
              ["CA-06", "Auditoría metodológica", "0 errores críticos antes de exportar"],
              ["CA-07", "Pareto visual", "Gráfico con % acumulado y clasificación CRÍTICA/SECUNDARIA"],
              ["CA-08", "Árbol de Objetivos", "Espejado correcto sin verbos de acción en objetivo central"],
              ["CA-09", "Exportación PDF", "PDF DACYTI generado en menos de 10 segundos"],
              ["CA-10", "Edición manual", "El analista puede editar cualquier nodo del árbol"],
            ].map(([id, criterio, condicion]) => (
              <View key={id} style={{ flexDirection: "row", gap: 6, paddingVertical: 2, borderBottomWidth: 0.5, borderBottomColor: "#f1f5f9" }}>
                <Text style={{ fontSize: 6.5, fontFamily: "Helvetica-Bold", color: C.azulMedio, width: 32 }}>{id}</Text>
                <Text style={{ fontSize: 6.5, fontFamily: "Helvetica-Bold", color: C.grisOscuro, flex: 1 }}>{criterio}</Text>
                <Text style={{ fontSize: 6.5, fontFamily: "Helvetica", color: C.grisMedio, flex: 2 }}>{condicion}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Strategic Tree Builder v1.0 — DACYTI</Text>
          <Text style={styles.footerText}>Página 2 de 2</Text>
          <Text style={styles.footerText}>{fecha}</Text>
        </View>
      </Page>
    </Document>
  );
}
