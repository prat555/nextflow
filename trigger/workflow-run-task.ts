import { task } from "@trigger.dev/sdk"
import type { Edge, Node } from "@xyflow/react"
import { executeWorkflowServer } from "@/lib/workflow-executor-server"

export type WorkflowRunTaskPayload = {
  runId: string
  workflowId: string
  userId: string
  nodes: Node[]
  edges: Edge[]
  mode: "full" | "selected" | "single"
  selectedNodeIds?: string[]
}

export const workflowRunTask = task({
  id: "workflow-run-task",
  run: async (payload: WorkflowRunTaskPayload) => {
    return executeWorkflowServer(payload)
  },
})

export async function enqueueWorkflowRunTask(payload: WorkflowRunTaskPayload) {
  return workflowRunTask.trigger(payload)
}
