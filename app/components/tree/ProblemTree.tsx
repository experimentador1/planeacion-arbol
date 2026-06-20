"use client";

import { useCallback, useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  addEdge,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
  type Connection,
} from "reactflow";
import "reactflow/dist/style.css";
import { TreeNode, type TreeNodeData } from "./TreeNode";
import type { ArbolProblemas } from "@/types";

const NODE_TYPES = { treeNode: TreeNode };

function buildNodes(arbol: ArbolProblemas): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Problema Central — centro
  const pcId = "pc";
  nodes.push({
    id: pcId,
    type: "treeNode",
    position: { x: 400, y: 300 },
    data: { label: arbol.problema_central, tipo: "problema" } satisfies TreeNodeData,
  });

  // Efectos — encima del problema
  arbol.efectos.forEach((efecto, i) => {
    const eId = efecto.id;
    nodes.push({
      id: eId,
      type: "treeNode",
      position: { x: 150 + i * 280, y: 60 },
      data: { label: efecto.enunciado, tipo: "efecto" } satisfies TreeNodeData,
    });
    edges.push({
      id: `e-${eId}-${pcId}`,
      source: pcId,
      target: eId,
      animated: false,
      style: { stroke: "#a855f7", strokeWidth: 2 },
    });
  });

  // Causas directas — debajo del problema
  arbol.causas_directas.forEach((causa, i) => {
    const cId = causa.id;
    const cx = 80 + i * 300;
    nodes.push({
      id: cId,
      type: "treeNode",
      position: { x: cx, y: 560 },
      data: {
        label: causa.enunciado,
        tipo: "causa_directa",
        clasificacion: causa.clasificacion_pareto,
      } satisfies TreeNodeData,
    });
    edges.push({
      id: `e-${cId}-${pcId}`,
      source: cId,
      target: pcId,
      style: { stroke: "#f97316", strokeWidth: 2 },
    });

    // Causas secundarias
    causa.causas_secundarias.forEach((cs, j) => {
      const csId = cs.id;
      nodes.push({
        id: csId,
        type: "treeNode",
        position: { x: cx - 60 + j * 140, y: 800 },
        data: { label: cs.enunciado, tipo: "causa_secundaria" } satisfies TreeNodeData,
      });
      edges.push({
        id: `e-${csId}-${cId}`,
        source: csId,
        target: cId,
        style: { stroke: "#eab308", strokeWidth: 1.5 },
      });
    });
  });

  return { nodes, edges };
}

interface Props {
  arbol: ArbolProblemas;
  onArbolChange?: (arbol: ArbolProblemas) => void;
}

export function ProblemTree({ arbol, onArbolChange }: Props) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildNodes(arbol),
    [arbol]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (connection: Connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  return (
    <div className="w-full h-[600px] rounded-xl border border-gray-200 overflow-hidden shadow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-right"
      >
        <Background color="#f1f5f9" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
