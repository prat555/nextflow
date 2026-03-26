import type { Edge, Node } from "@xyflow/react"

export type DagValidation = {
  valid: boolean
  cycle?: string[]
}

export function validateDAG(nodes: Node[], edges: Edge[]): DagValidation {
  const adjacency = new Map<string, string[]>()
  for (const n of nodes) adjacency.set(n.id, [])
  for (const e of edges) {
    adjacency.get(e.source)?.push(e.target)
  }

  const visiting = new Set<string>()
  const visited = new Set<string>()
  const stack: string[] = []

  const dfs = (nodeId: string): DagValidation => {
    if (visiting.has(nodeId)) {
      const start = stack.indexOf(nodeId)
      const cycle = start >= 0 ? stack.slice(start).concat(nodeId) : [nodeId]
      return { valid: false, cycle }
    }
    if (visited.has(nodeId)) return { valid: true }

    visiting.add(nodeId)
    stack.push(nodeId)

    for (const next of adjacency.get(nodeId) ?? []) {
      const result = dfs(next)
      if (!result.valid) return result
    }

    stack.pop()
    visiting.delete(nodeId)
    visited.add(nodeId)
    return { valid: true }
  }

  for (const n of nodes) {
    const result = dfs(n.id)
    if (!result.valid) return result
  }

  return { valid: true }
}

export function buildExecutionPhases(nodes: Node[], edges: Edge[], restrictedNodeIds?: Set<string>): string[][] {
  const nodeIds = restrictedNodeIds ? new Set(restrictedNodeIds) : new Set(nodes.map((n) => n.id))
  const indegree = new Map<string, number>()
  const outgoing = new Map<string, string[]>()

  for (const nodeId of nodeIds) {
    indegree.set(nodeId, 0)
    outgoing.set(nodeId, [])
  }

  for (const edge of edges) {
    if (!nodeIds.has(edge.source) || !nodeIds.has(edge.target)) continue
    outgoing.get(edge.source)?.push(edge.target)
    indegree.set(edge.target, (indegree.get(edge.target) ?? 0) + 1)
  }

  let frontier = [...indegree.entries()].filter(([, deg]) => deg === 0).map(([id]) => id)
  const phases: string[][] = []
  const processed = new Set<string>()

  while (frontier.length > 0) {
    phases.push(frontier)
    const next: string[] = []

    for (const nodeId of frontier) {
      processed.add(nodeId)
      for (const target of outgoing.get(nodeId) ?? []) {
        indegree.set(target, (indegree.get(target) ?? 1) - 1)
        if ((indegree.get(target) ?? 0) === 0) {
          next.push(target)
        }
      }
    }

    frontier = next
  }

  if (processed.size !== nodeIds.size) {
    // Fallback: include remaining nodes in a final phase so the UI still progresses.
    const remaining = [...nodeIds].filter((id) => !processed.has(id))
    if (remaining.length > 0) phases.push(remaining)
  }

  return phases
}
