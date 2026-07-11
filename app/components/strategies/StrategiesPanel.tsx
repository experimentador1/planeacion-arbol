"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type {
  AnalisisEstrategico,
  FuerzaPorter,
  IntensidadFuerza,
  TipoEstrategiaPorter,
  HorizonteTemporal,
  PrioridadEstrategia,
  EstrategiaPorter,
} from "@/types";

// ─── Helpers de presentación ──────────────────────────────────────────────────

const INTENSIDAD_COLORS: Record<IntensidadFuerza, string> = {
  ALTA: "bg-red-100 text-red-800 border-red-300",
  MEDIA: "bg-amber-100 text-amber-800 border-amber-300",
  BAJA: "bg-emerald-100 text-emerald-800 border-emerald-300",
};

const INTENSIDAD_ICONS: Record<IntensidadFuerza, string> = {
  ALTA: "🔴",
  MEDIA: "🟡",
  BAJA: "🟢",
};

const TIPO_COLORS: Record<TipoEstrategiaPorter, string> = {
  DIFERENCIACION: "bg-purple-100 text-purple-800 border-purple-300",
  EFICIENCIA_INSTITUCIONAL: "bg-blue-100 text-blue-800 border-blue-300",
  ENFOQUE: "bg-teal-100 text-teal-800 border-teal-300",
};

const TIPO_LABELS: Record<TipoEstrategiaPorter, string> = {
  DIFERENCIACION: "Diferenciación",
  EFICIENCIA_INSTITUCIONAL: "Eficiencia Institucional",
  ENFOQUE: "Enfoque/Especialización",
};

const HORIZONTE_LABELS: Record<HorizonteTemporal, string> = {
  CORTO_PLAZO: "Corto plazo",
  MEDIANO_PLAZO: "Mediano plazo",
  LARGO_PLAZO: "Largo plazo",
};

const PRIORIDAD_COLORS: Record<PrioridadEstrategia, string> = {
  CRITICA: "bg-red-600 text-white",
  ALTA: "bg-orange-500 text-white",
  MEDIA: "bg-amber-400 text-white",
};

// ─── Sub-componentes ──────────────────────────────────────────────────────────

function FuerzaCard({ nombre, fuerza }: { nombre: string; fuerza: FuerzaPorter }) {
  return (
    <div className={`rounded-lg border p-3 ${INTENSIDAD_COLORS[fuerza.intensidad]}`}>
      <div className="flex items-center justify-between mb-1">
        <span className="font-semibold text-sm">{nombre}</span>
        <span className="text-xs font-bold">
          {INTENSIDAD_ICONS[fuerza.intensidad]} {fuerza.intensidad}
        </span>
      </div>
      <p className="text-xs leading-relaxed">{fuerza.descripcion}</p>
      <p className="text-xs mt-1.5 font-medium opacity-80">
        → {fuerza.implicacion_estrategica}
      </p>
    </div>
  );
}

function EstrategiaCard({ estrategia }: { estrategia: EstrategiaPorter }) {
  return (
    <Card className="border border-gray-200 hover:shadow-md transition-shadow">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={`text-[10px] px-2 py-0.5 ${TIPO_COLORS[estrategia.tipo]}`}>
              {TIPO_LABELS[estrategia.tipo]}
            </Badge>
            <Badge className={`text-[10px] px-2 py-0.5 ${PRIORIDAD_COLORS[estrategia.prioridad]}`}>
              {estrategia.prioridad}
            </Badge>
            <Badge variant="outline" className="text-[10px] px-2 py-0.5">
              {HORIZONTE_LABELS[estrategia.horizonte]}
            </Badge>
          </div>
          <span className="text-xs text-gray-400 shrink-0">{estrategia.id}</span>
        </div>
        <CardTitle className="text-sm font-bold text-gray-800 mt-2 leading-snug">
          {estrategia.nombre}
        </CardTitle>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-3">
        <p className="text-sm text-gray-600 leading-relaxed">{estrategia.descripcion}</p>

        <div className="bg-purple-50 border border-purple-200 rounded-md p-2.5">
          <p className="text-xs font-semibold text-purple-700 mb-0.5">Ventaja distintiva</p>
          <p className="text-xs text-purple-600">{estrategia.ventaja_distintiva}</p>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-md p-2.5">
          <p className="text-xs font-semibold text-red-700 mb-0.5">
            Trade-off (lo que NO haremos)
          </p>
          <p className="text-xs text-red-600">{estrategia.trade_off}</p>
        </div>

        {estrategia.actividades_clave.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-gray-600 mb-1">Actividades clave</p>
            <ul className="space-y-0.5">
              {estrategia.actividades_clave.map((act, i) => (
                <li key={i} className="text-xs text-gray-600 flex gap-1.5">
                  <span className="text-blue-400 shrink-0">▸</span>
                  {act}
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="border-t border-gray-100 pt-2 flex flex-wrap gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Indicador</p>
            <p className="text-xs text-gray-700">{estrategia.indicador}</p>
          </div>
          {estrategia.medio_vinculado && (
            <div className="flex-1 min-w-0">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-0.5">Medio vinculado</p>
              <p className="text-xs text-gray-500 truncate">{estrategia.medio_vinculado}</p>
            </div>
          )}
        </div>

        {estrategia.evidencia?.length > 0 && (
          <details className="group">
            <summary className="text-[10px] text-gray-400 cursor-pointer hover:text-gray-600 select-none">
              Ver evidencia documental ({estrategia.evidencia.length})
            </summary>
            <ul className="mt-1.5 space-y-0.5">
              {estrategia.evidencia.map((ev, i) => (
                <li key={i} className="text-[10px] text-gray-500 italic pl-2 border-l border-gray-200">
                  {ev}
                </li>
              ))}
            </ul>
          </details>
        )}
      </CardContent>
    </Card>
  );
}

// ─── Panel principal ──────────────────────────────────────────────────────────

interface StrategiesPanelProps {
  analisis: AnalisisEstrategico;
}

export function StrategiesPanel({ analisis }: StrategiesPanelProps) {
  const { cinco_fuerzas, lineas_estrategicas, trade_offs_criticos, calce_actividades } = analisis;

  const FUERZAS_LABELS: Record<string, string> = {
    rivalidad_institucional: "Rivalidad institucional",
    poder_financiadores: "Poder de financiadores/autoridades",
    amenaza_nuevos_actores: "Amenaza de nuevos actores",
    poder_proveedores: "Poder de proveedores/aliados",
    presion_sustitutos: "Presión de sustitutos",
  };

  return (
    <div className="space-y-8">
      {/* Resumen ejecutivo */}
      <Card className="bg-slate-800 border-slate-700">
        <CardContent className="pt-5 pb-5">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">🎯</span>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-widest mb-1.5">
                Posicionamiento estratégico — Marco Porter · Harvard
              </p>
              <p className="text-white font-semibold text-sm leading-relaxed mb-2">
                {analisis.posicionamiento_recomendado}
              </p>
              <Badge className={`${TIPO_COLORS[analisis.estrategia_generica]} text-xs px-3`}>
                Estrategia genérica: {TIPO_LABELS[analisis.estrategia_generica]}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 rounded-lg px-4 py-3 border border-gray-200">
        {analisis.resumen_ejecutivo}
      </p>

      {/* Cinco fuerzas */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <h3 className="font-bold text-gray-800 text-lg">Análisis de las 5 Fuerzas</h3>
          <Badge variant="outline" className="text-xs">Porter 2008</Badge>
        </div>

        {cinco_fuerzas.fuerza_dominante && (
          <div className="mb-3 bg-red-50 border border-red-200 rounded-lg px-4 py-2 flex items-center gap-2">
            <span className="text-sm">⚠️</span>
            <p className="text-xs text-red-700">
              <span className="font-semibold">Fuerza dominante:</span> {cinco_fuerzas.fuerza_dominante}
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {Object.entries(FUERZAS_LABELS).map(([key, label]) => {
            const fuerza = cinco_fuerzas[key as keyof typeof cinco_fuerzas];
            if (typeof fuerza === "string") return null;
            return (
              <FuerzaCard
                key={key}
                nombre={label}
                fuerza={fuerza as FuerzaPorter}
              />
            );
          })}
        </div>

        {cinco_fuerzas.resumen && (
          <p className="text-sm text-gray-600 mt-3 italic border-l-4 border-slate-300 pl-3">
            {cinco_fuerzas.resumen}
          </p>
        )}
      </section>

      {/* Líneas estratégicas */}
      <section>
        <h3 className="font-bold text-gray-800 text-lg mb-4">Líneas Estratégicas</h3>
        <div className="space-y-6">
          {lineas_estrategicas.map((linea) => (
            <div key={linea.id}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-xs font-bold text-gray-400">{linea.id}</span>
                <h4 className="font-semibold text-gray-700">{linea.nombre}</h4>
                <Badge className={`text-[10px] px-2 ${TIPO_COLORS[linea.tipo]}`}>
                  {TIPO_LABELS[linea.tipo]}
                </Badge>
              </div>
              {linea.objetivo_vinculado && (
                <p className="text-xs text-gray-400 mb-3 flex items-center gap-1">
                  <span>↳ Alineada a:</span>
                  <span className="italic">{linea.objetivo_vinculado}</span>
                </p>
              )}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {linea.estrategias.map((est) => (
                  <EstrategiaCard key={est.id} estrategia={est} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trade-offs críticos */}
      {trade_offs_criticos?.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-bold text-gray-800 text-lg">Trade-offs Críticos</h3>
            <span className="text-xs text-gray-400 italic">"La esencia de la estrategia es elegir lo que NO haremos" — Porter</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <ul className="space-y-2">
              {trade_offs_criticos.map((to, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-red-800">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-red-200 text-red-700 text-xs flex items-center justify-center font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {to}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Calce de actividades */}
      {calce_actividades?.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="font-bold text-gray-800 text-lg">Calce de Actividades</h3>
            <span className="text-xs text-gray-400 italic">Actividades que se refuerzan entre sí</span>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <ul className="space-y-2">
              {calce_actividades.map((calce, i) => (
                <li key={i} className="flex items-start gap-2.5 text-sm text-blue-800">
                  <span className="shrink-0 text-blue-400 mt-0.5">⬡</span>
                  {calce}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </div>
  );
}
