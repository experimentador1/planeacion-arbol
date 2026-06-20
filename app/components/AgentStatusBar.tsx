"use client";

import { AGENTE_META } from "@/lib/conductor";
import type { AgentStatus } from "@/types";

interface Props {
  agentes: AgentStatus;
}

const STATUS_STYLES = {
  idle: "bg-gray-100 text-gray-400 border-gray-200",
  running: "bg-blue-50 text-blue-600 border-blue-300 animate-pulse",
  done: "bg-emerald-50 text-emerald-700 border-emerald-300",
  error: "bg-red-50 text-red-600 border-red-300",
};

const STATUS_ICONS = {
  idle: "○",
  running: "⟳",
  done: "✓",
  error: "✗",
};

export function AgentStatusBar({ agentes }: Props) {
  return (
    <div className="flex flex-wrap gap-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
      {(Object.keys(AGENTE_META) as (keyof typeof AGENTE_META)[]).map((key) => {
        const agentKey = key as keyof AgentStatus;
        const status = agentes[agentKey];
        const meta = AGENTE_META[key];
        return (
          <div
            key={key}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-full border font-medium transition-all ${STATUS_STYLES[status]}`}
          >
            <span className="font-bold">{STATUS_ICONS[status]}</span>
            <span>{meta.nombre}</span>
          </div>
        );
      })}
    </div>
  );
}
