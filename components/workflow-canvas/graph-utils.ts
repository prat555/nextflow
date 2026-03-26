import type { Edge, Node } from "@xyflow/react"

import type {
  InputHandleType,
  NodeKind,
  OutputType,
  WorkflowNodeData,
  WorkflowHistoryNodeDetail,
} from "./types"

export function getOutputTypeForHandle(kind: NodeKind, handleId: string): OutputType | null {
  // Support both new canonical output handle id and legacy ids for saved drafts.
  if (handleId !== "output" && handleId !== "text_out" && handleId !== "image_out" && handleId !== "video_out") {
    return null
  }

  switch (kind) {
    case "text":
    case "llm":
      return handleId === "output" || handleId === "text_out" ? "text" : null
    case "uploadImage":
    case "cropImage":
    case "extractFrame":
      return handleId === "output" || handleId === "image_out" ? "image" : null
    case "uploadVideo":
      return handleId === "output" || handleId === "video_out" ? "video" : null
    default:
      return null
  }
}

export function getInputTypeForHandle(kind: NodeKind, handleId: string): OutputType | null {
  // Inputs are mapped by handle ids (same ids across nodes).
  if (kind === "llm") {
    if (handleId === "system_prompt") return "text"
    if (handleId === "user_message") return "text"
    if (handleId === "images") return "image"
    return null
  }

  if (kind === "cropImage") {
    if (handleId === "image_url") return "image"
    if (handleId === "x_percent") return "text"
    if (handleId === "y_percent") return "text"
    if (handleId === "width_percent") return "text"
    if (handleId === "height_percent") return "text"
    return null
  }

  if (kind === "extractFrame") {
    if (handleId === "video_url") return "video"
    if (handleId === "timestamp") return "text"
    return null
  }

  // Other nodes have no input handles.
  return null
}

export function getNodeById(nodes: Node<WorkflowNodeData>[], nodeId: string): Node<WorkflowNodeData> | undefined {
  return nodes.find((n) => n.id === nodeId)
}

export function isConnectedToHandle(edges: Edge<any>[], nodeId: string, handleId: string) {
  return edges.some((e: any) => e.target === nodeId && e.targetHandle === handleId)
}

export function getHandleIncomingValue({
  edges,
  nodes,
  targetNodeId,
  targetHandleId,
}: {
  edges: Edge<any>[]
  nodes: Node<WorkflowNodeData>[]
  targetNodeId: string
  targetHandleId: string
}) {
  const incoming = edges.filter((e: any) => e.target === targetNodeId && e.targetHandle === targetHandleId)
  if (incoming.length === 0) return null

  // For our simulation, we only need the first input for singular inputs.
  const first = incoming[0]
  const sourceNode = getNodeById(nodes, first.source)
  if (!sourceNode) return null

  // Output value is computed based on node kind + source handle.
  // This function is only used by the simulation runner, where nodes already have output fields.
  const sourceData = sourceNode.data as any
  if (!sourceData) return null
  if (first.sourceHandle === "output") {
    const sourceKind = (sourceNode.data as WorkflowNodeData).kind
    if (sourceKind === "text" || sourceKind === "llm") return sourceData.outputText ?? sourceData.text ?? null
    if (sourceKind === "uploadVideo") return sourceData.videoUrl ?? null
    return sourceData.croppedUrl ?? sourceData.imageUrl ?? sourceData.frameUrl ?? null
  }
  if (first.sourceHandle === "text_out") return sourceData.outputText ?? sourceData.text ?? null
  if (first.sourceHandle === "image_out") return sourceData.croppedUrl ?? sourceData.imageUrl ?? sourceData.frameUrl ?? null
  if (first.sourceHandle === "video_out") return sourceData.videoUrl ?? null
  return null
}

export function willCreateCycle({
  nodes,
  edges,
  source,
  target,
}: {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge<any>[]
  source: string
  target: string
}) {
  if (source === target) return true

  const adjacency = new Map<string, Set<string>>()
  for (const n of nodes) adjacency.set(n.id, new Set<string>())
  for (const e of edges) {
    const anyEdge: any = e
    if (anyEdge.source && anyEdge.target) {
      if (!adjacency.has(anyEdge.source)) adjacency.set(anyEdge.source, new Set())
      adjacency.get(anyEdge.source)!.add(anyEdge.target)
    }
  }

  // Adding source -> target creates a cycle if target can reach source.
  const stack: string[] = [target]
  const visited = new Set<string>()
  while (stack.length) {
    const cur = stack.pop()!
    if (cur === source) return true
    if (visited.has(cur)) continue
    visited.add(cur)
    const next = adjacency.get(cur)
    if (!next) continue
    for (const nxt of next) stack.push(nxt)
  }

  return false
}

export function getTopoOrder({
  nodes,
  edges,
  restrictedNodeIds,
}: {
  nodes: Node<WorkflowNodeData>[]
  edges: Edge<any>[]
  restrictedNodeIds?: Set<string>
}) {
  const nodeIds = restrictedNodeIds ? new Set(restrictedNodeIds) : new Set(nodes.map((n) => n.id))

  const indegree = new Map<string, number>()
  const outgoing = new Map<string, Set<string>>()
  for (const id of nodeIds) {
    indegree.set(id, 0)
    outgoing.set(id, new Set())
  }

  for (const e of edges) {
    const anyEdge: any = e
    const s = anyEdge.source as string
    const t = anyEdge.target as string
    if (!nodeIds.has(s) || !nodeIds.has(t)) continue
    outgoing.get(s)?.add(t)
    indegree.set(t, (indegree.get(t) ?? 0) + 1)
  }

  const queue: string[] = []
  for (const [id, deg] of indegree.entries()) {
    if (deg === 0) queue.push(id)
  }

  const order: string[] = []
  while (queue.length) {
    const id = queue.shift()!
    order.push(id)
    const outs = outgoing.get(id) ?? new Set()
    for (const t of outs) {
      indegree.set(t, (indegree.get(t) ?? 0) - 1)
      if ((indegree.get(t) ?? 0) === 0) queue.push(t)
    }
  }

  // If there was a cycle, order might be shorter; still return what we have.
  return order
}

export function buildHistoryNodeDetail({
  node,
  durationMs,
  status,
  outputPreview,
  error,
}: {
  node: Node<WorkflowNodeData>
  durationMs: number
  status: WorkflowHistoryNodeDetail["status"]
  outputPreview?: string
  error?: string
}): WorkflowHistoryNodeDetail {
  return {
    nodeId: node.id,
    nodeName: node.data.kind
      ? String(
          node.data.kind === "text"
            ? "Text Node"
            : node.data.kind === "uploadImage"
              ? "Upload Image"
              : node.data.kind === "uploadVideo"
                ? "Upload Video"
                : node.data.kind === "llm"
                  ? "LLM Node"
                  : node.data.kind === "cropImage"
                    ? "Crop Image"
                    : "Extract Frame",
        )
      : "Node",
    durationMs,
    status,
    outputPreview,
    error,
  }
}

export function getDefaultNodeName(kind: NodeKind) {
  switch (kind) {
    case "text":
      return "Text Node"
    case "uploadImage":
      return "Upload Image"
    case "uploadVideo":
      return "Upload Video"
    case "llm":
      return "LLM Node"
    case "cropImage":
      return "Crop Image"
    case "extractFrame":
      return "Extract Frame"
    default:
      return "Node"
  }
}

