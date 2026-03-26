import type { Edge, Node } from "@xyflow/react"

type WorkflowRecord = {
  id: string
  userId: string
  name: string
  nodes: Node[]
  edges: Edge[]
  createdAt: string
  updatedAt: string
}

type NodeRunRecord = {
  id: string
  workflowRunId: string
  nodeId: string
  nodeType: string
  status: "success" | "failed" | "running"
  input: unknown
  output: unknown
  error?: string
  duration: number
}

type WorkflowRunRecord = {
  id: string
  workflowId: string
  status: "success" | "failed" | "partial" | "running"
  scope: "full" | "partial" | "single"
  startedAt: string
  completedAt?: string
  duration?: number
  nodeRuns: NodeRunRecord[]
}

type InMemoryDb = {
  workflows: WorkflowRecord[]
  runs: WorkflowRunRecord[]
}

const globalKey = "__nextflow_in_memory_db__"

type GlobalWithDb = typeof globalThis & {
  [globalKey]?: InMemoryDb
}

const g = globalThis as GlobalWithDb
if (!g[globalKey]) {
  g[globalKey] = { workflows: [], runs: [] }
}

export const workflowDb = g[globalKey] as InMemoryDb

export function getRequestUserId(request: Request): string {
  return request.headers.get("x-user-id") || "demo-user"
}

export type { WorkflowRecord, WorkflowRunRecord, NodeRunRecord }
