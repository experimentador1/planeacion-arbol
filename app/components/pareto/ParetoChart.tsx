"use client";

import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { AnalisisPareto } from "@/types";

interface Props {
  pareto: AnalisisPareto;
}

const COLORS = {
  CRÍTICA: "#ef4444",
  SECUNDARIA: "#94a3b8",
};

export function ParetoChart({ pareto }: Props) {
  const data = pareto.causas_priorizadas.map((c) => ({
    name: c.id,
    enunciado: c.enunciado.length > 40 ? c.enunciado.slice(0, 40) + "…" : c.enunciado,
    puntaje: c.puntaje_total,
    acumulado: c.porcentaje_acumulado,
    clasificacion: c.clasificacion,
    fill: COLORS[c.clasificacion],
  }));

  return (
    <div className="w-full space-y-3">
      <h3 className="text-sm font-semibold text-gray-700 uppercase tracking-wide">
        Análisis de Pareto — Priorización de Causas
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis
            dataKey="name"
            tick={{ fontSize: 11 }}
            tickLine={false}
          />
          <YAxis
            yAxisId="left"
            orientation="left"
            tick={{ fontSize: 11 }}
            label={{ value: "Puntaje", angle: -90, position: "insideLeft", style: { fontSize: 11 } }}
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            domain={[0, 100]}
            tick={{ fontSize: 11 }}
            label={{ value: "% Acumulado", angle: 90, position: "insideRight", style: { fontSize: 11 } }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0]?.payload as (typeof data)[0];
              return (
                <div className="bg-white border rounded shadow p-2 text-xs max-w-48">
                  <p className="font-semibold">{d.name}</p>
                  <p className="text-gray-600 mt-1">{d.enunciado}</p>
                  <p className="mt-1">Puntaje: <span className="font-bold">{d.puntaje}</span></p>
                  <p>% Acumulado: <span className="font-bold">{d.acumulado?.toFixed(1)}%</span></p>
                  <p>
                    Clasificación:{" "}
                    <span
                      className={`font-bold ${d.clasificacion === "CRÍTICA" ? "text-red-600" : "text-slate-500"}`}
                    >
                      {d.clasificacion}
                    </span>
                  </p>
                </div>
              );
            }}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Bar
            yAxisId="left"
            dataKey="puntaje"
            name="Puntaje total"
            radius={[4, 4, 0, 0]}
            isAnimationActive
          >
            {data.map((entry, index) => (
              <rect key={index} fill={entry.fill} />
            ))}
          </Bar>
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="acumulado"
            name="% Acumulado"
            stroke="#3b82f6"
            strokeWidth={2}
            dot={{ r: 3, fill: "#3b82f6" }}
          />
          <ReferenceLine
            yAxisId="right"
            y={80}
            stroke="#f59e0b"
            strokeDasharray="6 3"
            label={{ value: "80%", fill: "#f59e0b", fontSize: 11 }}
          />
        </ComposedChart>
      </ResponsiveContainer>

      {/* Leyenda de clasificación */}
      <div className="flex gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-red-500" />
          <span className="text-gray-600">Causas críticas ({pareto.causas_criticas.length})</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded bg-slate-400" />
          <span className="text-gray-600">Causas secundarias ({pareto.causas_secundarias.length})</span>
        </div>
      </div>

      {/* Tabla de referencia: qué es cada ID */}
      <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="px-3 py-2 text-left font-semibold text-gray-600 w-12">ID</th>
              <th className="px-3 py-2 text-left font-semibold text-gray-600">Causa</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-600 w-16">Puntaje</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-600 w-20">% Acum.</th>
              <th className="px-3 py-2 text-center font-semibold text-gray-600 w-24">Clasificación</th>
            </tr>
          </thead>
          <tbody>
            {pareto.causas_priorizadas.map((c, i) => (
              <tr key={c.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-3 py-2 font-bold text-gray-700">{c.id}</td>
                <td className="px-3 py-2 text-gray-700 leading-snug">{c.enunciado}</td>
                <td className="px-3 py-2 text-center text-gray-700 font-medium">{c.puntaje_total}</td>
                <td className="px-3 py-2 text-center text-gray-700">{c.porcentaje_acumulado.toFixed(1)}%</td>
                <td className="px-3 py-2 text-center">
                  <span className={`inline-block px-2 py-0.5 rounded-full font-semibold text-[10px] ${
                    c.clasificacion === "CRÍTICA"
                      ? "bg-red-100 text-red-700"
                      : "bg-slate-100 text-slate-600"
                  }`}>
                    {c.clasificacion}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
