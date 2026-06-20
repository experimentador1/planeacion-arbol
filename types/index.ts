// ─── Documentos ────────────────────────────────────────────────────────────────
export interface Documento {
  nombre: string;
  tipo: "pdf" | "docx" | "xlsx";
  contenido: string;
  paginas: number;
}

// ─── Hallazgos del Librarian ─────────────────────────────────────────────────
export type TipoHallazgo = "PROBLEMA" | "CAUSA" | "EFECTO" | "DATO" | "CONTEXTO";

export interface Hallazgo {
  tipo: TipoHallazgo;
  enunciado: string;
  original: string;
  fuente: string;
  pagina: number;
}

// ─── FODA ────────────────────────────────────────────────────────────────────
export interface ElementoFODA {
  id: string;
  enunciado: string;
  fuente?: string;
}

export interface FODA {
  fortalezas: ElementoFODA[];
  debilidades: ElementoFODA[];
  oportunidades: ElementoFODA[];
  amenazas: ElementoFODA[];
}

export interface ResultadoFODA {
  foda: FODA;
  debilidades_prioritarias: string[];
}

// ─── Problema Central ────────────────────────────────────────────────────────
export interface CandidatoProblema {
  ranking: number;
  problema: string;
  peso_sistemico: number;
  causas_identificadas: number;
  efectos_identificados: number;
  evidencia: string[];
  justificacion: string;
}

// ─── Árbol de Problemas ──────────────────────────────────────────────────────
export interface Nodo {
  id: string;
  enunciado: string;
  evidencia: string;
  fuente: string;
}

export interface CausaSecundaria extends Nodo {}

export interface CausaDirecta extends Nodo {
  causas_secundarias: CausaSecundaria[];
  puntaje_pareto: number;
  clasificacion_pareto: "CRÍTICA" | "SECUNDARIA";
}

export interface Efecto extends Nodo {}

export interface ArbolProblemas {
  problema_central: string;
  efectos: Efecto[];
  causas_directas: CausaDirecta[];
}

// ─── Pareto ──────────────────────────────────────────────────────────────────
export interface CausaPriorizada {
  id: string;
  enunciado: string;
  frecuencia: number;
  impacto: number;
  controlabilidad: number;
  urgencia: number;
  alineacion: number;
  puntaje_total: number;
  porcentaje_acumulado: number;
  clasificacion: "CRÍTICA" | "SECUNDARIA";
  justificacion: string;
}

export interface AnalisisPareto {
  causas_priorizadas: CausaPriorizada[];
  causas_criticas: string[];
  causas_secundarias: string[];
}

// ─── Auditoría ───────────────────────────────────────────────────────────────
export interface ErrorAuditoria {
  nodo_id: string;
  tipo_error: string;
  descripcion: string;
  sugerencia: string;
}

export interface ResultadoAuditoria {
  aprobado: boolean;
  errores: ErrorAuditoria[];
  observaciones_generales: string;
  calidad_metodologica: "ALTA" | "MEDIA" | "BAJA";
}

// ─── Árbol de Objetivos ──────────────────────────────────────────────────────
export interface MedioEspecifico {
  id: string;
  enunciado: string;
}

export interface MedioDirecto {
  id: string;
  enunciado: string;
  medios_especificos: MedioEspecifico[];
}

export interface Fin {
  id: string;
  enunciado: string;
}

export interface ArbolObjetivos {
  objetivo_central: string;
  fines: Fin[];
  medios_directos: MedioDirecto[];
}

// ─── Estado de Sesión (Zustand) ───────────────────────────────────────────────
export type PasoFlujo =
  | "upload"
  | "foda"
  | "problem"
  | "causal"
  | "audit"
  | "objectives"
  | "export";

export interface AgentStatus {
  librarian: "idle" | "running" | "done" | "error";
  foda: "idle" | "running" | "done" | "error";
  problem: "idle" | "running" | "done" | "error";
  causal: "idle" | "running" | "done" | "error";
  pareto: "idle" | "running" | "done" | "error";
  audit: "idle" | "running" | "done" | "error";
  export: "idle" | "running" | "done" | "error";
}

export interface SessionState {
  paso_actual: PasoFlujo;
  agentes: AgentStatus;
  documentos: Documento[];
  hallazgos: Hallazgo[];
  foda: FODA | null;
  debilidades_prioritarias: string[];
  candidatos_problema: CandidatoProblema[];
  problema_central: string;
  arbol_problemas: ArbolProblemas | null;
  pareto: AnalisisPareto | null;
  auditoria: ResultadoAuditoria | null;
  arbol_objetivos: ArbolObjetivos | null;
  // Acciones
  setPasoActual: (paso: PasoFlujo) => void;
  setAgentStatus: (agente: keyof AgentStatus, status: AgentStatus[keyof AgentStatus]) => void;
  setDocumentos: (docs: Documento[]) => void;
  setHallazgos: (hallazgos: Hallazgo[]) => void;
  setFODA: (foda: FODA, prioritarias: string[]) => void;
  setCandidatos: (candidatos: CandidatoProblema[]) => void;
  setProblemaCentral: (problema: string) => void;
  setArbolProblemas: (arbol: ArbolProblemas) => void;
  setPareto: (pareto: AnalisisPareto) => void;
  setAuditoria: (auditoria: ResultadoAuditoria) => void;
  setArbolObjetivos: (arbol: ArbolObjetivos) => void;
  resetSession: () => void;
}
