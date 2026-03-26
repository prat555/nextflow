import { useCallback, useEffect, useRef } from "react"

import { useWorkflowStore } from "@/components/workflow-canvas/workflow-store"
import type { WorkflowHistoryEntry } from "@/components/workflow-canvas/types"

export function useExecution(workflowId: string) {
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  const nodes = useWorkflowStore((s) => s.nodes)
  const edges = useWorkflowStore((s) => s.edges)
  const history = useWorkflowStore((s) => s.history)
  const workflowName = useWorkflowStore((s) => s.workflowName)
  const isRunning = useWorkflowStore((s) => s.isExecuting)
  const setIsExecuting = useWorkflowStore((s) => s.setIsExecuting)
  const setRunningNodes = useWorkflowStore((s) => s.setRunningNodes)
  const setHistoryEntries = useWorkflowStore((s) => s.setHistoryEntries)
  const updateNodeData = useWorkflowStore((s) => s.updateNodeData)

  useEffect(() => {
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current)
      }
    }
  }, [])

  const startExecution = useCallback(
    async (mode: "full" | "partial" | "single", selectedNodeIds?: string[]) => {
      if (isRunning || nodes.length === 0) return
      const nodesToRun = mode === "full" ? nodes.map((n) => n.id) : (selectedNodeIds ?? [])
      if (mode !== "full" && nodesToRun.length === 0) return

      setIsExecuting(true)
      setRunningNodes(nodesToRun, true)

      try {
        await fetch(`/api/workflows/${workflowId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ nodes, edges, name: workflowName }),
        })

        const startRes = await fetch("/api/execute", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            workflowId,
            nodes,
            edges,
            mode,
            selectedNodeIds,
          }),
        })

        if (!startRes.ok) throw new Error("Failed to start execution")

        const startBody = await startRes.json()
        const runId = String(startBody.runId || "")
        if (!runId) throw new Error("Missing runId")

        if (pollRef.current) {
          clearInterval(pollRef.current)
        }

        pollRef.current = setInterval(async () => {
          try {
            const pollRes = await fetch(`/api/runs/${runId}`)
            if (!pollRes.ok) return

            const pollData = await pollRes.json()
            const run = pollData.run ?? pollData
            const nodeRuns = run?.nodeRuns ?? []

            const runningIds = nodeRuns.filter((nr: any) => nr.status === "running").map((nr: any) => nr.nodeId)
            setRunningNodes(nodesToRun, false)
            if (runningIds.length > 0) setRunningNodes(runningIds, true)

            for (const nodeRun of nodeRuns) {
              if (nodeRun.status === "failed") {
                updateNodeData(nodeRun.nodeId, {
                  execution: "failed",
                  errorMessage: "Unable to fetch output",
                } as any)
                continue
              }

              if (nodeRun.status === "success") {
                const outputValue = nodeRun?.output?.output
                const updates: Record<string, unknown> = {
                  execution: "executed",
                  errorMessage: undefined,
                }

                const node = nodes.find((n) => n.id === nodeRun.nodeId)
                if (node?.type === "llm") {
                  updates.outputText = typeof outputValue === "string" ? outputValue : nodeRun.outputPreview
                } else if (node?.type === "cropImage" && typeof outputValue === "string") {
                  updates.croppedUrl = outputValue
                } else if (node?.type === "extractFrame" && typeof outputValue === "string") {
                  updates.frameUrl = outputValue
                }

                updateNodeData(nodeRun.nodeId, updates as any)
              }
            }

            if (run?.status === "success" || run?.status === "failed" || run?.status === "partial") {
              if (pollRef.current) {
                clearInterval(pollRef.current)
                pollRef.current = null
              }

              const entry: WorkflowHistoryEntry = {
                id: run.id,
                timestamp: run.startedAt,
                status: run.status,
                durationMs: run.durationMs || 0,
                scope: run.scope === "full" ? "Full Workflow" : run.scope === "single" ? "Single Node" : "Partial",
                nodeDetails:
                  nodeRuns?.map((nr: any) => ({
                    nodeId: nr.nodeId,
                    nodeName: nr.nodeName,
                    durationMs: nr.durationMs,
                    status: nr.status,
                    outputPreview: nr.outputPreview,
                    error: nr.error,
                  })) || [],
              }

              setHistoryEntries([entry, ...history.filter((h) => h.id !== entry.id)])
              setRunningNodes(nodesToRun, false)
              setIsExecuting(false)
            }
          } catch {
            // Keep polling until terminal status or manual retry.
          }
        }, 2000)
      } catch {
        setRunningNodes(nodesToRun, false)
        setIsExecuting(false)
      }
    },
    [
      edges,
      history,
      isRunning,
      nodes,
      setHistoryEntries,
      setIsExecuting,
      setRunningNodes,
      updateNodeData,
      workflowId,
      workflowName,
    ],
  )

  return { isRunning, startExecution }
}
