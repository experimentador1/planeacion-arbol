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

// ─── Análisis Estratégico Porter ─────────────────────────────────────────────

export type IntensidadFuerza = "ALTA" | "MEDIA" | "BAJA";
export type TipoEstrategiaPorter = "DIFERENCIACION" | "EFICIENCIA_INSTITUCIONAL" | "ENFOQUE";
export type HorizonteTemporal = "CORTO_PLAZO" | "MEDIANO_PLAZO" | "LARGO_PLAZO";
export type PrioridadEstrategia = "CRITICA" | "ALTA" | "MEDIA";

export interface FuerzaPorter {
  intensidad: IntensidadFuerza;
  descripcion: string;
  implicacion_estrategica: string;
}

export interface AnalisisCincoFuerzas {
  rivalidad_institucional: FuerzaPorter;
  poder_financiadores: FuerzaPorter;
  amenaza_nuevos_actores: FuerzaPorter;
  poder_proveedores: FuerzaPorter;
  presion_sustitutos: FuerzaPorter;
  fuerza_dominante: string;
  resumen: string;
}

export interface EstrategiaPorter {
  id: string;
  tipo: TipoEstrategiaPorter;
  nombre: string;
  descripcion: string;
  medio_vinculado: string;
  causa_critica_vinculada: string;
  ventaja_distintiva: string;
  actividades_clave: string[];
  trade_off: string;
  indicador: string;
  horizonte: HorizonteTemporal;
  prioridad: PrioridadEstrategia;
  evidencia: string[];
}

export interface LineaEstrategica {
  id: string;
  nombre: string;
  tipo: TipoEstrategiaPorter;
  objetivo_vinculado: string;
  estrategias: EstrategiaPorter[];
}

export interface AnalisisEstrategico {
  cinco_fuerzas: AnalisisCincoFuerzas;
  posicionamiento_recomendado: string;
  estrategia_generica: TipoEstrategiaPorter;
  lineas_estrategicas: LineaEstrategica[];
  trade_offs_criticos: string[];
  calce_actividades: string[];
  resumen_ejecutivo: string;
}

// ─── Matriz FODA Cruzada (Estrategias Operativas) ────────────────────────────

export type TipoCuadranteFODA = "FO" | "FA" | "DO" | "DA";
export type PrioridadOperativa = "ALTA" | "MEDIA" | "BAJA";
export type HorizonteOperativo = "INMEDIATO" | "CORTO_PLAZO" | "MEDIANO_PLAZO";

export interface EstrategiaOperativa {
  id: string;
  descripcion: string;
  fortalezas_vinculadas: string[];
  factores_externos_vinculados: string[];
  insight_porter: string;
  prioridad: PrioridadOperativa;
  indicador_exito: string;
  responsable_sugerido: string;
  horizonte: HorizonteOperativo;
}

export interface CuadranteFODA {
  tipo: TipoCuadranteFODA;
  titulo: string;
  orientacion: string;
  descripcion_logica: string;
  estrategias: EstrategiaOperativa[];
}

export interface MatrizFodaCruzada {
  FO: CuadranteFODA;
  FA: CuadranteFODA;
  DO: CuadranteFODA;
  DA: CuadranteFODA;
  estrategia_dominante: string;
  sintesis_ejecutiva: string;
  acciones_prioritarias: string[];
}

// ─── Pipeline Matriz FODA Completa (multi-agente) ────────────────────────────

export interface ContextoCompleto {
  // FODA
  fortalezas: string[];
  debilidades: string[];
  oportunidades: string[];
  amenazas: string[];
  debilidades_prioritarias: string[];
  // Porter
  posicionamiento: string;
  estrategia_generica: string;
  fuerza_dominante: string;
  lineas_estrategicas: string[];
  trade_offs: string[];
  calce_actividades: string[];
  resumen_porter: string;
  // Árbol de problemas
  problema_central: string;
  causas_directas: string[];
  causas_criticas: string[];
  efectos: string[];
  // Árbol de objetivos
  objetivo_central: string;
  medios_directos: string[];
  fines: string[];
  // Hallazgos documentales
  hallazgos_problema: string[];
  hallazgos_causa: string[];
  hallazgos_dato: string[];
  hallazgos_contexto: string[];
  // Auditoría
  calidad_metodologica: string;
  observaciones_auditoria: string;
}

export interface TensionEstrategica {
  descripcion: string;
  elementos_foda: string[];
  cuadrante_sugerido: TipoCuadranteFODA;
  relevancia: "CRITICA" | "ALTA" | "MEDIA";
}

export interface ContextoValidado {
  contexto: ContextoCompleto;
  tensiones_estrategicas: TensionEstrategica[];
  combinaciones_fo: string[][];
  combinaciones_fa: string[][];
  combinaciones_do: string[][];
  combinaciones_da: string[][];
  observaciones_validacion: string[];
  total_combinaciones_identificadas: number;
}

export interface MetadatoCuadrante {
  total_estrategias: number;
  prioridades: { ALTA: number; MEDIA: number; BAJA: number };
  horizontes: { INMEDIATO: number; CORTO_PLAZO: number; MEDIANO_PLAZO: number };
  resumen_ejecutivo: string;
  mensaje_director: string;
}

export interface MatrizFodaCompleta {
  FO: CuadranteFODA;
  FA: CuadranteFODA;
  DO: CuadranteFODA;
  DA: CuadranteFODA;
  metadatos: {
    FO: MetadatoCuadrante;
    FA: MetadatoCuadrante;
    DO: MetadatoCuadrante;
    DA: MetadatoCuadrante;
  };
  total_estrategias: number;
  estrategia_dominante: string;
  sintesis_ejecutiva: string;
  mensaje_para_direccion: string;
  acciones_inmediatas: string[];
  acciones_corto_plazo: string[];
  acciones_mediano_plazo: string[];
  fuentes_consideradas: string[];
}

export type PipelineMatrizStep =
  | "idle"
  | "recolectando"
  | "validando"
  | "organizando"
  | "revisando"
  | "done"
  | "error";

// ─── Estado de Sesión (Zustand) ───────────────────────────────────────────────
export type PasoFlujo =
  | "upload"
  | "foda"
  | "problem"
  | "causal"
  | "audit"
  | "objectives"
  | "strategies"
  | "export";

export interface AgentStatus {
  librarian: "idle" | "running" | "done" | "error";
  foda: "idle" | "running" | "done" | "error";
  problem: "idle" | "running" | "done" | "error";
  causal: "idle" | "running" | "done" | "error";
  pareto: "idle" | "running" | "done" | "error";
  audit: "idle" | "running" | "done" | "error";
  export: "idle" | "running" | "done" | "error";
  strategies: "idle" | "running" | "done" | "error";
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
  analisis_estrategico: AnalisisEstrategico | null;
  matriz_foda: MatrizFodaCruzada | null;
  matriz_foda_completa: MatrizFodaCompleta | null;
  pipeline_matriz_step: PipelineMatrizStep;
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
  setAnalisisEstrategico: (analisis: AnalisisEstrategico) => void;
  setMatrizFoda: (matriz: MatrizFodaCruzada) => void;
  setMatrizFodaCompleta: (matriz: MatrizFodaCompleta) => void;
  setPipelineMatrizStep: (step: PipelineMatrizStep) => void;
  resetSession: () => void;
}
