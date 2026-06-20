"use client";

import { useMemo } from "react";
import ReactFlow, {
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  type Node,
  type Edge,
} from "reactflow";
import "reactflow/dist/style.css";
import { TreeNode, type TreeNodeData } from "./TreeNode";
import type { ArbolObjetivos } from "@/types";

const NODE_TYPES = { treeNode: TreeNode };

function buildObjectiveNodes(arbol: ArbolObjetivos): { nodes: Node[]; edges: Edge[] } {
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Objetivo Central
  const ocId = "oc";
  nodes.push({
    id: ocId,
    type: "treeNode",
    position: { x: 400, y: 300 },
    data: { label: arbol.objetivo_central, tipo: "objetivo" } satisfies TreeNodeData,
  });

  // Fines — encima
  arbol.fines.forEach((fin, i) => {
    nodes.push({
      id: fin.id,
      type: "treeNode",
      position: { x: 150 + i * 280, y: 60 },
      data: { label: fin.enunciado, tipo: "fin" } satisfies TreeNodeData,
    });
    edges.push({
      id: `e-${fin.id}-${ocId}`,
      source: ocId,
      target: fin.id,
      style: { stroke: "#0ea5e9", strokeWidth: 2 },
    });
  });

  // Medios directos — debajo
  arbol.medios_directos.forEach((medio, i) => {
    const mId = medio.id;
    const mx = 80 + i * 300;
    nodes.push({
      id: mId,
      type: "treeNode",
      position: { x: mx, y: 560 },
      data: { label: medio.enunciado, tipo: "medio" } satisfies TreeNodeData,
    });
    edges.push({
      id: `e-${mId}-${ocId}`,
      source: mId,
      target: ocId,
      style: { stroke: "#14b8a6", strokeWidth: 2 },
    });

    // Medios específicos
    medio.medios_especificos.forEach((me, j) => {
      nodes.push({
        id: me.id,
        type: "treeNode",
        position: { x: mx - 60 + j * 140, y: 800 },
        data: { label: me.enunciado, tipo: "medio" } satisfies TreeNodeData,
      });
      edges.push({
        id: `e-${me.id}-${mId}`,
        source: me.id,
        target: mId,
        style: { stroke: "#22c55e", strokeWidth: 1.5 },
      });
    });
  });

  return { nodes, edges };
}

interface Props {
  arbol: ArbolObjetivos;
}

export function ObjectiveTree({ arbol }: Props) {
  const { nodes: initialNodes, edges: initialEdges } = useMemo(
    () => buildObjectiveNodes(arbol),
    [arbol]
  );

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, , onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div className="w-full h-[600px] rounded-xl border border-gray-200 overflow-hidden shadow">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NODE_TYPES}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        attributionPosition="bottom-right"
      >
        <Background color="#f0fdf4" gap={20} />
        <Controls />
      </ReactFlow>
    </div>
  );
}
