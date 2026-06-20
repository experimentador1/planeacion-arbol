"use client";

import { useState } from "react";
import { Handle, Position, type NodeProps } from "reactflow";

export type TreeNodeData = {
  label: string;
  tipo: "problema" | "causa_directa" | "causa_secundaria" | "efecto" | "objetivo" | "medio" | "fin";
  clasificacion?: "CRÍTICA" | "SECUNDARIA";
  evidencia?: string;
  onEdit?: (nuevoTexto: string) => void;
};

const ESTILOS: Record<TreeNodeData["tipo"], { bg: string; border: string; text: string; badge?: string }> = {
  problema: {
    bg: "bg-rose-600",
    border: "border-rose-700",
    text: "text-white",
    badge: "Problema Central",
  },
  objetivo: {
    bg: "bg-emerald-600",
    border: "border-emerald-700",
    text: "text-white",
    badge: "Objetivo Central",
  },
  causa_directa: {
    bg: "bg-orange-100",
    border: "border-orange-400",
    text: "text-orange-900",
    badge: "Causa Directa",
  },
  causa_secundaria: {
    bg: "bg-yellow-50",
    border: "border-yellow-300",
    text: "text-yellow-900",
    badge: "Causa Secundaria",
  },
  efecto: {
    bg: "bg-purple-100",
    border: "border-purple-400",
    text: "text-purple-900",
    badge: "Efecto",
  },
  medio: {
    bg: "bg-teal-100",
    border: "border-teal-400",
    text: "text-teal-900",
    badge: "Medio",
  },
  fin: {
    bg: "bg-sky-100",
    border: "border-sky-400",
    text: "text-sky-900",
    badge: "Fin",
  },
};

export function TreeNode({ data }: NodeProps<TreeNodeData>) {
  const [editing, setEditing] = useState(false);
  const [text, setText] = useState(data.label);
  const estilo = ESTILOS[data.tipo];

  const handleDoubleClick = () => {
    if (data.onEdit) setEditing(true);
  };

  const handleSave = () => {
    data.onEdit?.(text);
    setEditing(false);
  };

  return (
    <div
      className={`
        relative rounded-lg border-2 p-3 shadow-sm cursor-default select-none
        ${estilo.bg} ${estilo.border} ${estilo.text}
        min-w-[160px] max-w-[220px]
        ${data.clasificacion === "CRÍTICA" ? "ring-2 ring-red-400 ring-offset-1" : ""}
      `}
      onDoubleClick={handleDoubleClick}
      title="Doble clic para editar"
    >
      <Handle type="target" position={Position.Top} className="!bg-gray-400 !w-2 !h-2" />

      {estilo.badge && (
        <span className="block text-[9px] font-bold uppercase tracking-wider opacity-70 mb-1">
          {estilo.badge}
        </span>
      )}

      {editing ? (
        <div className="space-y-1">
          <textarea
            className="w-full text-xs bg-white text-gray-800 border rounded p-1 resize-none focus:outline-none"
            rows={3}
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoFocus
          />
          <div className="flex gap-1">
            <button
              className="text-[10px] bg-white/30 px-2 py-0.5 rounded hover:bg-white/50"
              onClick={handleSave}
            >
              ✓
            </button>
            <button
              className="text-[10px] bg-white/20 px-2 py-0.5 rounded hover:bg-white/40"
              onClick={() => { setText(data.label); setEditing(false); }}
            >
              ✕
            </button>
          </div>
        </div>
      ) : (
        <p className="text-xs leading-snug font-medium">{text}</p>
      )}

      {data.clasificacion && (
        <span
          className={`mt-1 inline-block text-[9px] font-bold px-1.5 py-0.5 rounded
            ${data.clasificacion === "CRÍTICA" ? "bg-red-500 text-white" : "bg-gray-300 text-gray-700"}`}
        >
          {data.clasificacion}
        </span>
      )}

      <Handle type="source" position={Position.Bottom} className="!bg-gray-400 !w-2 !h-2" />
    </div>
  );
}
