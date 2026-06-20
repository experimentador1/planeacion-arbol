"use client";

import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
} from "@react-pdf/renderer";
import type { ArbolProblemas, ArbolObjetivos } from "@/types";

// Helvetica está integrada en PDF como fuente estándar, no requiere registro externo

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#ffffff",
    padding: 30,
    fontFamily: "Helvetica",
  },
  header: {
    backgroundColor: "#1e3a5f",
    padding: 12,
    marginBottom: 16,
    borderRadius: 4,
  },
  headerTitle: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  headerSubtitle: {
    color: "#93c5fd",
    fontSize: 9,
    textAlign: "center",
    marginTop: 3,
  },
  problemBox: {
    backgroundColor: "#fee2e2",
    borderColor: "#dc2626",
    borderWidth: 2,
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    alignSelf: "center",
    width: "60%",
  },
  problemLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#dc2626",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  problemText: {
    fontSize: 10,
    color: "#7f1d1d",
    textAlign: "center",
  },
  objetivoBox: {
    backgroundColor: "#dcfce7",
    borderColor: "#16a34a",
    borderWidth: 2,
    borderRadius: 6,
    padding: 10,
    marginBottom: 16,
    alignSelf: "center",
    width: "60%",
  },
  objetivoLabel: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#16a34a",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  objetivoText: {
    fontSize: 10,
    color: "#14532d",
    textAlign: "center",
  },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 8,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 6,
    textAlign: "center",
  },
  causasSection: {
    marginTop: 4,
  },
  causaDirectaBox: {
    backgroundColor: "#fff7ed",
    borderColor: "#f97316",
    borderWidth: 1.5,
    borderRadius: 4,
    padding: 6,
    marginBottom: 6,
  },
  causaDirectaId: {
    fontSize: 7,
    color: "#c2410c",
    fontWeight: "bold",
    marginBottom: 2,
  },
  causaDirectaText: {
    fontSize: 8,
    color: "#7c2d12",
  },
  causaSecundariaBox: {
    backgroundColor: "#fefce8",
    borderColor: "#eab308",
    borderWidth: 1,
    borderRadius: 3,
    padding: 4,
    marginLeft: 10,
    marginTop: 3,
  },
  causaSecundariaText: {
    fontSize: 7,
    color: "#713f12",
  },
  efectoBox: {
    backgroundColor: "#faf5ff",
    borderColor: "#a855f7",
    borderWidth: 1.5,
    borderRadius: 4,
    padding: 6,
    marginBottom: 4,
  },
  efectoText: {
    fontSize: 8,
    color: "#6b21a8",
  },
  medioBox: {
    backgroundColor: "#f0fdfa",
    borderColor: "#14b8a6",
    borderWidth: 1.5,
    borderRadius: 4,
    padding: 6,
    marginBottom: 6,
  },
  medioText: {
    fontSize: 8,
    color: "#134e4a",
  },
  finBox: {
    backgroundColor: "#f0f9ff",
    borderColor: "#0ea5e9",
    borderWidth: 1.5,
    borderRadius: 4,
    padding: 6,
    marginBottom: 4,
  },
  finText: {
    fontSize: 8,
    color: "#0c4a6e",
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 30,
    right: 30,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 7,
    color: "#9ca3af",
  },
});

interface Props {
  arbolProblemas: ArbolProblemas;
  arbolObjetivos: ArbolObjetivos;
}

export function DACYTIPdf({ arbolProblemas, arbolObjetivos }: Props) {
  const fecha = new Date().toLocaleDateString("es-MX", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <Document>
      {/* Lámina 1: Árbol de Problemas */}
      <Page size="A3" orientation="landscape" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>ÁRBOL DE PROBLEMAS</Text>
          <Text style={styles.headerSubtitle}>
            Marco Lógico · Formato DACYTI · {fecha}
          </Text>
        </View>

        {/* Efectos */}
        <Text style={[styles.sectionLabel, { color: "#7c3aed" }]}>Efectos</Text>
        <View style={styles.sectionRow}>
          {arbolProblemas.efectos.map((e) => (
            <View key={e.id} style={styles.efectoBox}>
              <Text style={styles.efectoText}>{e.enunciado}</Text>
            </View>
          ))}
        </View>

        {/* Problema Central */}
        <View style={styles.problemBox}>
          <Text style={styles.problemLabel}>▶ Problema Central</Text>
          <Text style={styles.problemText}>{arbolProblemas.problema_central}</Text>
        </View>

        {/* Causas */}
        <Text style={[styles.sectionLabel, { color: "#c2410c" }]}>Causas</Text>
        <View style={styles.sectionRow}>
          {arbolProblemas.causas_directas.map((c) => (
            <View key={c.id} style={{ flex: 1 }}>
              <View style={styles.causaDirectaBox}>
                <Text style={styles.causaDirectaId}>{c.id}</Text>
                <Text style={styles.causaDirectaText}>{c.enunciado}</Text>
              </View>
              {c.causas_secundarias.map((cs) => (
                <View key={cs.id} style={styles.causaSecundariaBox}>
                  <Text style={styles.causaSecundariaText}>{cs.enunciado}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Strategic Tree Builder v1.0 · DACYTI</Text>
          <Text style={styles.footerText}>Árbol de Problemas · Página 1 de 2</Text>
        </View>
      </Page>

      {/* Lámina 2: Árbol de Objetivos */}
      <Page size="A3" orientation="landscape" style={styles.page}>
        <View style={[styles.header, { backgroundColor: "#14532d" }]}>
          <Text style={styles.headerTitle}>ÁRBOL DE OBJETIVOS</Text>
          <Text style={styles.headerSubtitle}>
            Marco Lógico · Formato DACYTI · {fecha}
          </Text>
        </View>

        {/* Fines */}
        <Text style={[styles.sectionLabel, { color: "#0c4a6e" }]}>Fines</Text>
        <View style={styles.sectionRow}>
          {arbolObjetivos.fines.map((f) => (
            <View key={f.id} style={styles.finBox}>
              <Text style={styles.finText}>{f.enunciado}</Text>
            </View>
          ))}
        </View>

        {/* Objetivo Central */}
        <View style={styles.objetivoBox}>
          <Text style={styles.objetivoLabel}>▶ Objetivo Central</Text>
          <Text style={styles.objetivoText}>{arbolObjetivos.objetivo_central}</Text>
        </View>

        {/* Medios */}
        <Text style={[styles.sectionLabel, { color: "#0f766e" }]}>Medios</Text>
        <View style={styles.sectionRow}>
          {arbolObjetivos.medios_directos.map((m) => (
            <View key={m.id} style={{ flex: 1 }}>
              <View style={styles.medioBox}>
                <Text style={styles.medioText}>{m.enunciado}</Text>
              </View>
              {m.medios_especificos.map((me) => (
                <View key={me.id} style={[styles.medioBox, { marginLeft: 10, backgroundColor: "#ccfbf1" }]}>
                  <Text style={[styles.medioText, { fontSize: 7 }]}>{me.enunciado}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Strategic Tree Builder v1.0 · DACYTI</Text>
          <Text style={styles.footerText}>Árbol de Objetivos · Página 2 de 2</Text>
        </View>
      </Page>
    </Document>
  );
}
