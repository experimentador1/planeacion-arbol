import { create } from "zustand";
import type {
  SessionState,
  PasoFlujo,
  AgentStatus,
  Documento,
  Hallazgo,
  FODA,
  CandidatoProblema,
  ArbolProblemas,
  AnalisisPareto,
  ResultadoAuditoria,
  ArbolObjetivos,
} from "@/types";

const initialAgentStatus: AgentStatus = {
  librarian: "idle",
  foda: "idle",
  problem: "idle",
  causal: "idle",
  pareto: "idle",
  audit: "idle",
  export: "idle",
};

export const useSTBStore = create<SessionState>((set) => ({
  paso_actual: "upload",
  agentes: { ...initialAgentStatus },
  documentos: [],
  hallazgos: [],
  foda: null,
  debilidades_prioritarias: [],
  candidatos_problema: [],
  problema_central: "",
  arbol_problemas: null,
  pareto: null,
  auditoria: null,
  arbol_objetivos: null,

  setPasoActual: (paso: PasoFlujo) => set({ paso_actual: paso }),

  setAgentStatus: (agente: keyof AgentStatus, status: AgentStatus[keyof AgentStatus]) =>
    set((state) => ({
      agentes: { ...state.agentes, [agente]: status },
    })),

  setDocumentos: (documentos: Documento[]) => set({ documentos }),

  setHallazgos: (hallazgos: Hallazgo[]) => set({ hallazgos }),

  setFODA: (foda: FODA, debilidades_prioritarias: string[]) =>
    set({ foda, debilidades_prioritarias }),

  setCandidatos: (candidatos_problema: CandidatoProblema[]) =>
    set({ candidatos_problema }),

  setProblemaCentral: (problema_central: string) => set({ problema_central }),

  setArbolProblemas: (arbol_problemas: ArbolProblemas) => set({ arbol_problemas }),

  setPareto: (pareto: AnalisisPareto) => set({ pareto }),

  setAuditoria: (auditoria: ResultadoAuditoria) => set({ auditoria }),

  setArbolObjetivos: (arbol_objetivos: ArbolObjetivos) => set({ arbol_objetivos }),

  resetSession: () =>
    set({
      paso_actual: "upload",
      agentes: { ...initialAgentStatus },
      documentos: [],
      hallazgos: [],
      foda: null,
      debilidades_prioritarias: [],
      candidatos_problema: [],
      problema_central: "",
      arbol_problemas: null,
      pareto: null,
      auditoria: null,
      arbol_objetivos: null,
    }),
}));
