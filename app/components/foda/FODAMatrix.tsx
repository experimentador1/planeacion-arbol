"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { FODA, ElementoFODA } from "@/types";

interface Props {
  foda: FODA;
  onConfirm: (foda: FODA) => void;
}

type CuadranteFODA = keyof FODA;

const CUADRANTES: { key: CuadranteFODA; label: string; color: string; bg: string }[] = [
  { key: "fortalezas", label: "Fortalezas", color: "text-emerald-700", bg: "bg-emerald-50 border-emerald-200" },
  { key: "oportunidades", label: "Oportunidades", color: "text-blue-700", bg: "bg-blue-50 border-blue-200" },
  { key: "debilidades", label: "Debilidades", color: "text-rose-700", bg: "bg-rose-50 border-rose-200" },
  { key: "amenazas", label: "Amenazas", color: "text-amber-700", bg: "bg-amber-50 border-amber-200" },
];

export function FODAMatrix({ foda: initialFoda, onConfirm }: Props) {
  const [foda, setFoda] = useState<FODA>(initialFoda);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");

  const handleEdit = (elemento: ElementoFODA) => {
    setEditingId(elemento.id);
    setEditText(elemento.enunciado);
  };

  const handleSave = (cuadrante: CuadranteFODA) => {
    setFoda((prev) => ({
      ...prev,
      [cuadrante]: prev[cuadrante].map((el) =>
        el.id === editingId ? { ...el, enunciado: editText } : el
      ),
    }));
    setEditingId(null);
    setEditText("");
  };

  const handleDelete = (cuadrante: CuadranteFODA, id: string) => {
    setFoda((prev) => ({
      ...prev,
      [cuadrante]: prev[cuadrante].filter((el) => el.id !== id),
    }));
  };

  const handleAdd = (cuadrante: CuadranteFODA) => {
    const prefix = cuadrante[0].toUpperCase();
    const newId = `${prefix}${foda[cuadrante].length + 1}`;
    setFoda((prev) => ({
      ...prev,
      [cuadrante]: [
        ...prev[cuadrante],
        { id: newId, enunciado: "Nuevo elemento (edita este texto)", fuente: "Manual" },
      ],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {CUADRANTES.map(({ key, label, color, bg }) => (
          <Card key={key} className={`border-2 ${bg}`}>
            <CardHeader className="pb-2">
              <CardTitle className={`text-sm font-semibold uppercase tracking-wide ${color}`}>
                {label}
                <Badge variant="outline" className="ml-2 text-xs">
                  {foda[key].length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {foda[key].map((el) => (
                <div
                  key={el.id}
                  className="group flex items-start gap-2 p-2 rounded-md bg-white/70 hover:bg-white transition-colors"
                >
                  {editingId === el.id ? (
                    <div className="flex-1 space-y-1">
                      <textarea
                        className="w-full text-sm border rounded p-1 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows={2}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        autoFocus
                      />
                      <div className="flex gap-1">
                        <Button size="sm" variant="default" onClick={() => handleSave(key)}>
                          Guardar
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => setEditingId(null)}>
                          Cancelar
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <span className="flex-1 text-sm text-gray-700 leading-snug">{el.enunciado}</span>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          className="text-xs text-blue-500 hover:text-blue-700 px-1"
                          onClick={() => handleEdit(el)}
                        >
                          ✏️
                        </button>
                        <button
                          className="text-xs text-red-400 hover:text-red-600 px-1"
                          onClick={() => handleDelete(key, el.id)}
                        >
                          ✕
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
              <button
                className={`w-full text-xs ${color} border border-dashed border-current rounded p-1.5 hover:bg-white/50 transition-colors`}
                onClick={() => handleAdd(key)}
              >
                + Agregar elemento
              </button>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="flex justify-end">
        <Button size="lg" onClick={() => onConfirm(foda)} className="px-8">
          Confirmar FODA →
        </Button>
      </div>
    </div>
  );
}
