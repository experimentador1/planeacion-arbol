"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useSTBStore } from "@/lib/store";
import { AgentStatusBar } from "./components/AgentStatusBar";
import { FODAMatrix } from "./components/foda/FODAMatrix";
import { ProblemTree } from "./components/tree/ProblemTree";
import { ObjectiveTree } from "./components/tree/ObjectiveTree";
import { ParetoChart } from "./components/pareto/ParetoChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { PASO_LABELS, siguientePaso } from "@/lib/conductor";
import { StrategiesPanel } from "./components/strategies/StrategiesPanel";
import type { FODA, CandidatoProblema, Documento, Hallazgo, AnalisisEstrategico, MatrizFodaCruzada } from "@/types";

const PASOS_PROGRESO = ["upload", "foda", "strategies", "problem", "causal", "audit", "objectives", "export"];

function UploadScreen() {
  const { setAgentStatus, setDocumentos, setHallazgos, setPasoActual, agentes } = useSTBStore();
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState<File[]>([]);

  const onDrop = useCallback((accepted: File[]) => {
    setFileList((prev) => [...prev, ...accepted]);
    setError(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document": [".docx"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [".xlsx"],
      "application/vnd.ms-excel": [".xls"],
    },
    maxSize: 20 * 1024 * 1024,
  });

  const handleProcess = async () => {
    if (fileList.length === 0) {
      setError("Agrega al menos un documento PDF o DOCX.");
      return;
    }
    setUploading(true);
    setError(null);
    setAgentStatus("librarian", "running");

    try {
      const formData = new FormData();
      fileList.forEach((f) => formData.append("files", f));

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json() as { error: string };
        throw new Error(err.error);
      }

      const data = await res.json() as {
        documentos: Omit<Documento, "contenido">[];
        hallazgos: Hallazgo[];
      };

      setDocumentos(
        fileList.map((f) => {
          const ext = f.name.split(".").pop()?.toLowerCase();
          return { nombre: f.name, tipo: ext === "pdf" ? "pdf" : ext === "docx" ? "docx" : "xlsx", contenido: "", paginas: 0 };
        })
      );
      setHallazgos(data.hallazgos);
      setAgentStatus("librarian", "done");
      setAgentStatus("foda", "running");

      // Ejecutar FODA automáticamente
      const fodaRes = await fetch("/api/foda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hallazgos: data.hallazgos }),
      });

      if (!fodaRes.ok) throw new Error("Error en FODA Agent");
      const fodaData = await fodaRes.json() as { foda: FODA; debilidades_prioritarias: string[] };

      useSTBStore.getState().setFODA(fodaData.foda, fodaData.debilidades_prioritarias);
      setAgentStatus("foda", "done");
      setPasoActual("foda");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      setAgentStatus("librarian", "error");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-gray-800">Carga de Documentos Institucionales</h2>
        <p className="text-gray-500 text-sm">
          Sube los documentos históricos (PDF o DOCX) que serán analizados por el Librarian Agent.
        </p>
      </div>

      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all
          ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:border-blue-400 hover:bg-gray-50"}
        `}
      >
        <input {...getInputProps()} />
        <div className="space-y-3">
          <div className="text-5xl">📄</div>
          <p className="text-gray-600 font-medium">
            {isDragActive ? "Suelta los archivos aquí" : "Arrastra archivos PDF, DOCX o XLSX"}
          </p>
          <p className="text-gray-400 text-sm">o haz clic para seleccionar · Máx. 20 MB por archivo</p>
        </div>
      </div>

      {fileList.length > 0 && (
        <div className="space-y-2">
          <p className="text-sm font-medium text-gray-700">Archivos seleccionados:</p>
          {fileList.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
              <span className="text-sm text-gray-700">{f.name}</span>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {(f.size / 1024).toFixed(0)} KB
                </Badge>
                <button
                  className="text-red-400 hover:text-red-600 text-xs"
                  onClick={() => setFileList((prev) => prev.filter((_, j) => j !== i))}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {uploading && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-blue-600">
            <span className="animate-spin">⟳</span>
            <span>Procesando documentos y extrayendo hallazgos…</span>
          </div>
          <Progress value={null} className="h-1.5" />
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        onClick={handleProcess}
        disabled={uploading || fileList.length === 0}
      >
        {uploading ? "Procesando…" : "Analizar Documentos →"}
      </Button>
    </div>
  );
}

function FODAScreen() {
  const {
    foda,
    debilidades_prioritarias,
    hallazgos,
    setAgentStatus,
    setAnalisisEstrategico,
    setPasoActual,
  } = useSTBStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!foda) return null;

  const handleConfirm = async (updatedFoda: FODA) => {
    setLoading(true);
    setError(null);
    setAgentStatus("strategies", "running");

    try {
      useSTBStore.getState().setFODA(updatedFoda, debilidades_prioritarias);

      const res = await fetch("/api/strategies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          foda: updatedFoda,
          debilidades_prioritarias,
          hallazgos,
        }),
      });

      if (!res.ok) throw new Error("Error en Strategic Advisor");
      const data = await res.json() as { analisis_estrategico: AnalisisEstrategico };

      if (data.analisis_estrategico) setAnalisisEstrategico(data.analisis_estrategico);
      setAgentStatus("strategies", "done");
      setPasoActual("strategies");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      setAgentStatus("strategies", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Validación del Análisis FODA</h2>
        <p className="text-gray-500 text-sm mt-1">
          Revisa, edita y confirma el FODA generado por IA antes de continuar.
          Puedes agregar, editar o eliminar cualquier elemento.
        </p>
      </div>

      {hallazgos.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 text-sm rounded-lg px-4 py-2">
          Se extrajeron <strong>{hallazgos.length} hallazgos</strong> de los documentos institucionales.
        </div>
      )}

      <FODAMatrix foda={foda} onConfirm={handleConfirm} />

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-slate-600">
          <span className="animate-spin">⟳</span>
          <span>Strategic Advisor analizando el entorno institucional con Marco Porter…</span>
        </div>
      )}
    </div>
  );
}

function ProblemScreen() {
  const { candidatos_problema, setAgentStatus, setArbolProblemas, setPareto, setProblemaCentral, setPasoActual, hallazgos } = useSTBStore();
  const [selected, setSelected] = useState<string>("");
  const [custom, setCustom] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    const problema = custom.trim() || selected;
    if (!problema) {
      setError("Selecciona o escribe el Problema Central.");
      return;
    }

    setLoading(true);
    setError(null);
    setProblemaCentral(problema);
    setAgentStatus("causal", "running");

    try {
      const res = await fetch("/api/causal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ problema_central: problema, hallazgos }),
      });

      if (!res.ok) throw new Error("Error en Causal Designer");
      const data = await res.json() as { arbol: ReturnType<typeof useSTBStore.getState>["arbol_problemas"]; pareto: ReturnType<typeof useSTBStore.getState>["pareto"] };

      if (data.arbol) setArbolProblemas(data.arbol);
      if (data.pareto) setPareto(data.pareto);
      setAgentStatus("causal", "done");
      setAgentStatus("pareto", "done");
      setPasoActual("causal");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      setAgentStatus("causal", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Selección del Problema Central</h2>
        <p className="text-gray-500 text-sm mt-1">
          El Problem Architect propone 3 candidatos rankeados. Selecciona uno o escribe el tuyo.
        </p>
      </div>

      <div className="space-y-4">
        {candidatos_problema.map((c) => (
          <Card
            key={c.ranking}
            className={`cursor-pointer transition-all border-2 ${
              selected === c.problema ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-blue-300"
            }`}
            onClick={() => { setSelected(c.problema); setCustom(""); }}
          >
            <CardHeader className="pb-2">
              <div className="flex items-center gap-3">
                <Badge className={c.ranking === 1 ? "bg-blue-600" : "bg-gray-400"}>
                  #{c.ranking}
                </Badge>
                <CardTitle className="text-sm font-semibold">{c.problema}</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-2">
              <p className="text-xs text-gray-600">{c.justificacion}</p>
              <div className="flex gap-4 text-xs text-gray-500">
                <span>Peso sistémico: <strong>{c.peso_sistemico}</strong></span>
                <span>Causas: <strong>{c.causas_identificadas}</strong></span>
                <span>Efectos: <strong>{c.efectos_identificados}</strong></span>
              </div>
              {c.evidencia.length > 0 && (
                <div className="bg-gray-50 rounded p-2">
                  <p className="text-xs font-medium text-gray-500 mb-1">Evidencia:</p>
                  {c.evidencia.map((ev, i) => (
                    <p key={i} className="text-xs text-gray-600 italic">"{ev}"</p>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-2">
        <p className="text-sm font-medium text-gray-700">O escribe tu propio Problema Central:</p>
        <textarea
          className="w-full border rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
          rows={2}
          placeholder="Ej. Baja productividad científica del personal académico"
          value={custom}
          onChange={(e) => { setCustom(e.target.value); setSelected(""); }}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <span className="animate-spin">⟳</span>
          <span>Causal Designer construyendo el Árbol de Problemas…</span>
        </div>
      )}

      <Button size="lg" className="w-full" onClick={handleConfirm} disabled={loading}>
        {loading ? "Construyendo árbol…" : "Confirmar Problema Central →"}
      </Button>
    </div>
  );
}

function CausalScreen() {
  const { arbol_problemas, pareto, setAgentStatus, setAuditoria, setPasoActual } = useSTBStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!arbol_problemas) return null;

  const handleAprobar = async () => {
    setLoading(true);
    setError(null);
    setAgentStatus("audit", "running");

    try {
      const res = await fetch("/api/audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arbol: arbol_problemas }),
      });

      if (!res.ok) throw new Error("Error en Methodological Auditor");
      const data = await res.json() as ReturnType<typeof useSTBStore.getState>["auditoria"];

      if (data) setAuditoria(data);
      setAgentStatus("audit", "done");
      setPasoActual("audit");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      setAgentStatus("audit", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Árbol de Problemas</h2>
        <p className="text-gray-500 text-sm mt-1">
          Visualización interactiva. Doble clic en cualquier nodo para editar.
          El panel inferior muestra el análisis de Pareto.
        </p>
      </div>

      <ProblemTree arbol={arbol_problemas} />

      {pareto && (
        <Card>
          <CardContent className="pt-4">
            <ParetoChart pareto={pareto} />
          </CardContent>
        </Card>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <span className="animate-spin">⟳</span>
          <span>Methodological Auditor validando el árbol…</span>
        </div>
      )}

      <Button size="lg" className="w-full" onClick={handleAprobar} disabled={loading}>
        {loading ? "Auditando…" : "Aprobar Árbol → Auditoría Metodológica"}
      </Button>
    </div>
  );
}

function AuditScreen() {
  const { auditoria, arbol_problemas, setAgentStatus, setArbolObjetivos, setPasoActual } = useSTBStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!auditoria) return null;

  const calidadColors = {
    ALTA: "bg-emerald-100 text-emerald-800 border-emerald-300",
    MEDIA: "bg-yellow-100 text-yellow-800 border-yellow-300",
    BAJA: "bg-red-100 text-red-800 border-red-300",
  };

  const calidadEmoji = { ALTA: "🟢", MEDIA: "🟡", BAJA: "🔴" };

  const handleContinuar = async () => {
    setLoading(true);
    setError(null);
    setAgentStatus("export", "running");

    try {
      const res = await fetch("/api/export", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ arbol: arbol_problemas }),
      });

      if (!res.ok) throw new Error("Error en Format Painter");
      const data = await res.json() as { arbol_objetivos: ReturnType<typeof useSTBStore.getState>["arbol_objetivos"] };

      if (data.arbol_objetivos) setArbolObjetivos(data.arbol_objetivos);
      setAgentStatus("export", "done");
      setPasoActual("objectives");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      setAgentStatus("export", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Auditoría Metodológica</h2>
        <p className="text-gray-500 text-sm mt-1">
          El Methodological Auditor verificó el árbol contra los criterios de Marco Lógico y DACYTI.
        </p>
      </div>

      {/* Semáforo de calidad */}
      <Card className={`border-2 ${calidadColors[auditoria.calidad_metodologica]}`}>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{calidadEmoji[auditoria.calidad_metodologica]}</span>
            <div>
              <p className="font-bold text-lg">
                Calidad Metodológica: {auditoria.calidad_metodologica}
              </p>
              <p className="text-sm mt-0.5">{auditoria.observaciones_generales}</p>
            </div>
            <div className="ml-auto">
              <Badge variant={auditoria.aprobado ? "default" : "destructive"} className="text-sm px-3 py-1">
                {auditoria.aprobado ? "✓ Aprobado" : "✗ Requiere correcciones"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Errores */}
      {auditoria.errores.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-700">Observaciones del auditor:</h3>
          {auditoria.errores.map((e, i) => (
            <Card key={i} className="border border-amber-200 bg-amber-50">
              <CardContent className="pt-3 pb-3 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">{e.nodo_id}</Badge>
                  <span className="text-xs font-semibold text-amber-800">{e.tipo_error}</span>
                </div>
                <p className="text-sm text-gray-700">{e.descripcion}</p>
                <p className="text-xs text-amber-700">💡 {e.sugerencia}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <span className="animate-spin">⟳</span>
          <span>Format Painter generando el Árbol de Objetivos…</span>
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        onClick={handleContinuar}
        disabled={loading}
      >
        {loading ? "Generando Árbol de Objetivos…" : "Generar Árbol de Objetivos →"}
      </Button>
    </div>
  );
}

function ObjectivesScreen() {
  const { arbol_objetivos, arbol_problemas, setPasoActual } = useSTBStore();
  const [downloading, setDownloading] = useState(false);

  if (!arbol_objetivos) return null;

  const handleExport = async () => {
    setDownloading(true);
    try {
      const ReactPDF = await import("@react-pdf/renderer");
      const { DACYTIPdf } = await import("./components/DACYTIPdf");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await (ReactPDF.pdf as any)(
        <DACYTIPdf
          arbolProblemas={arbol_problemas!}
          arbolObjetivos={arbol_objetivos}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `STB_DACYTI_${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      setPasoActual("export");
    } catch (e) {
      console.error("Error exportando PDF:", e);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Árbol de Objetivos</h2>
        <p className="text-gray-500 text-sm mt-1">
          Versión espejada en positivo del Árbol de Problemas, siguiendo las reglas de Marco Lógico.
        </p>
      </div>

      <ObjectiveTree arbol={arbol_objetivos} />

      <Card className="bg-emerald-50 border-emerald-200">
        <CardContent className="pt-4">
          <p className="font-semibold text-emerald-800">Objetivo Central:</p>
          <p className="text-emerald-700 mt-1">{arbol_objetivos.objetivo_central}</p>
        </CardContent>
      </Card>

      <Button
        size="lg"
        className="w-full bg-emerald-600 hover:bg-emerald-700"
        onClick={handleExport}
        disabled={downloading}
      >
        {downloading ? "Generando PDF…" : "📥 Exportar PDF DACYTI"}
      </Button>
    </div>
  );
}

function StrategiesScreen() {
  const {
    analisis_estrategico,
    foda,
    debilidades_prioritarias,
    hallazgos,
    matriz_foda,
    setAgentStatus,
    setCandidatos,
    setPasoActual,
    setMatrizFoda,
  } = useSTBStore();
  const [loading, setLoading] = useState(false);
  const [loadingMatriz, setLoadingMatriz] = useState(false);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!analisis_estrategico) return null;

  const handleGenerarMatriz = async () => {
    if (!foda || !analisis_estrategico) return;
    setLoadingMatriz(true);
    setError(null);
    try {
      const res = await fetch("/api/matriz-foda", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foda, analisis_estrategico }),
      });
      if (!res.ok) throw new Error("Error generando Matriz FODA");
      const data = await res.json() as { matriz: MatrizFodaCruzada };
      setMatrizFoda(data.matriz);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
    } finally {
      setLoadingMatriz(false);
    }
  };

  const handleDescargarMatrizPdf = async () => {
    if (!foda || !matriz_foda) return;
    setLoadingPdf(true);
    try {
      const ReactPDF = await import("@react-pdf/renderer");
      const { MatrizFodaPdf } = await import("./components/MatrizFodaPdf");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await (ReactPDF.pdf as any)(
        <MatrizFodaPdf foda={foda} matriz={matriz_foda} />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DACYTI_MatrizFODA_Operativa_${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error generando PDF Matriz FODA:", e);
      setError("Error al generar el PDF de la Matriz FODA");
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleContinuar = async () => {
    setLoading(true);
    setError(null);
    setAgentStatus("problem", "running");

    try {
      const res = await fetch("/api/problem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ foda, debilidades_prioritarias }),
      });

      if (!res.ok) throw new Error("Error en Problem Architect");
      const data = await res.json() as { candidatos: CandidatoProblema[] };

      setCandidatos(data.candidatos);
      setAgentStatus("problem", "done");
      setPasoActual("problem");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Error desconocido");
      setAgentStatus("problem", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Análisis Estratégico</h2>
          <p className="text-gray-500 text-sm mt-1">
            Módulo complementario · Strategic Advisor · Marco Porter · Harvard Business School
          </p>
        </div>
        <Badge variant="outline" className="text-xs shrink-0 mt-1.5">
          HBR 2008
        </Badge>
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
        Este análisis es un complemento estratégico basado en el FODA institucional.
        Al continuar, el flujo de Marco Lógico retoma con la identificación del Problema Central.
      </div>

      <StrategiesPanel analisis={analisis_estrategico} />

      {/* ── Bloque Matriz FODA Cruzada ── */}
      <div className="border border-emerald-200 rounded-xl bg-emerald-50 p-4 space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-semibold text-emerald-900 text-sm">
              Matriz FODA Cruzada · Estrategias Operativas
            </h3>
            <p className="text-xs text-emerald-700 mt-0.5">
              Genera estrategias FO, FA, DO y DA alimentadas con el análisis Porter. Producto PDF independiente.
            </p>
          </div>
          <Badge variant="outline" className="text-xs border-emerald-400 text-emerald-700 shrink-0">
            Nuevo
          </Badge>
        </div>

        {!matriz_foda ? (
          <Button
            size="sm"
            variant="outline"
            className="border-emerald-500 text-emerald-800 hover:bg-emerald-100 gap-1.5"
            onClick={handleGenerarMatriz}
            disabled={loadingMatriz}
          >
            {loadingMatriz ? (
              <><span className="animate-spin">⟳</span> Generando Matriz FODA…</>
            ) : (
              <>⊕ Generar Matriz FODA Cruzada</>
            )}
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="bg-white border border-emerald-200 rounded-lg px-3 py-2 text-xs text-emerald-800">
              <span className="font-semibold">Estrategia dominante:</span>{" "}
              {matriz_foda.estrategia_dominante}
            </div>
            <div className="flex gap-2 flex-wrap">
              {(["FO","FA","DO","DA"] as const).map((tipo) => (
                <span
                  key={tipo}
                  className="text-xs bg-white border border-emerald-300 rounded px-2 py-0.5 text-emerald-800 font-medium"
                >
                  {tipo}: {matriz_foda[tipo].estrategias.length} estrategias
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                className="bg-emerald-700 hover:bg-emerald-800 text-white gap-1.5"
                onClick={handleDescargarMatrizPdf}
                disabled={loadingPdf}
              >
                {loadingPdf ? (
                  <><span className="animate-spin">⟳</span> Generando PDF…</>
                ) : (
                  <>📊 Descargar Matriz FODA PDF</>
                )}
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="text-xs border-emerald-400 text-emerald-700"
                onClick={handleGenerarMatriz}
                disabled={loadingMatriz}
              >
                {loadingMatriz ? "Regenerando…" : "↻ Regenerar"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-4 py-3">
          {error}
        </div>
      )}

      {loading && (
        <div className="flex items-center gap-2 text-sm text-blue-600">
          <span className="animate-spin">⟳</span>
          <span>Problem Architect identificando candidatos al Problema Central…</span>
        </div>
      )}

      <Button
        size="lg"
        className="w-full"
        onClick={handleContinuar}
        disabled={loading}
      >
        {loading ? "Identificando Problema Central…" : "Continuar al Árbol de Problemas →"}
      </Button>
    </div>
  );
}

function DescargarReporteBtn() {
  const {
    foda,
    analisis_estrategico,
    arbol_problemas,
    pareto,
    auditoria,
    arbol_objetivos,
  } = useSTBStore();
  const [loading, setLoading] = useState(false);

  if (!foda) return null;

  const handleDescargar = async () => {
    setLoading(true);
    try {
      const ReactPDF = await import("@react-pdf/renderer");
      const { ReportePdf } = await import("./components/ReportePdf");

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const blob = await (ReactPDF.pdf as any)(
        <ReportePdf
          foda={foda}
          analisisEstrategico={analisis_estrategico}
          arbolProblemas={arbol_problemas}
          pareto={pareto}
          auditoria={auditoria}
          arbolObjetivos={arbol_objetivos}
        />
      ).toBlob();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `DACYTI_PlanDesarrollo2026_${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error("Error generando reporte:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      size="sm"
      variant="outline"
      onClick={handleDescargar}
      disabled={loading}
      className="text-xs gap-1.5 border-blue-300 text-blue-700 hover:bg-blue-50"
    >
      {loading ? (
        <>
          <span className="animate-spin">⟳</span>
          Generando…
        </>
      ) : (
        <>
          📄 Reporte completo
        </>
      )}
    </Button>
  );
}

export default function Home() {
  const { paso_actual, agentes, resetSession } = useSTBStore();

  const pasoIndex = PASOS_PROGRESO.indexOf(paso_actual);
  const progreso = Math.round(((pasoIndex + 1) / PASOS_PROGRESO.length) * 100);

  const renderPaso = () => {
    switch (paso_actual) {
      case "upload": return <UploadScreen />;
      case "foda": return <FODAScreen />;
      case "strategies": return <StrategiesScreen />;
      case "problem": return <ProblemScreen />;
      case "causal": return <CausalScreen />;
      case "audit": return <AuditScreen />;
      case "objectives":
      case "export": return <ObjectivesScreen />;
      default: return <UploadScreen />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              STB
            </div>
            <div>
              <h1 className="font-bold text-gray-900 text-sm leading-none">Strategic Tree Builder</h1>
              <p className="text-gray-500 text-xs">Marco Lógico · Formato DACYTI · v1.0</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs">
              {PASO_LABELS[paso_actual]}
            </Badge>

            <DescargarReporteBtn />

            <Button variant="ghost" size="sm" onClick={resetSession} className="text-xs text-gray-500">
              Nueva sesión
            </Button>
          </div>
        </div>

        {/* Barra de progreso */}
        <div className="max-w-6xl mx-auto px-4 pb-2">
          <Progress value={progreso} className="h-1" />
          <div className="flex justify-between mt-1">
            {PASOS_PROGRESO.map((paso, i) => (
              <span
                key={paso}
                className={`text-[10px] ${i <= pasoIndex ? "text-blue-600 font-medium" : "text-gray-400"}`}
              >
                {i + 1}
              </span>
            ))}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        {/* Estado de agentes */}
        <AgentStatusBar agentes={agentes} />

        <Separator />

        {/* Pantalla activa */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
          {renderPaso()}
        </div>
      </main>
    </div>
  );
}
