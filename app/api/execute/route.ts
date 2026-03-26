import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import type { Edge, Node } from "@xyflow/react"

import { db } from "@/lib/db"
import { ensureUserExists } from "@/lib/auth"
import { enqueueWorkflowRunTask } from "@/trigger/workflow-run-task"

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await ensureUserExists(clerkId)
    const body = await request.json().catch(() => ({}))

    const workflowId = String(body?.workflowId ?? "")
    const nodes = Array.isArray(body?.nodes) ? (body.nodes as Node[]) : []
    const edges = Array.isArray(body?.edges) ? (body.edges as Edge[]) : []
    const mode = body?.mode === "single" || body?.mode === "partial" ? body.mode : "full"
    const selectedNodeIds = Array.isArray(body?.selectedNodeIds) ? body.selectedNodeIds : []

    if (!workflowId) {
      return NextResponse.json({ error: "workflowId is required" }, { status: 400 })
    }

    const workflow = await db.workflow.findFirst({ where: { id: workflowId, userId: user.id } })
    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    await db.workflow.update({
      where: { id: workflow.id },
      data: {
        nodes,
        edges,
        updatedAt: new Date(),
      },
    })

    const normalizedScope = mode === "full" ? "full" : mode === "single" || selectedNodeIds.length <= 1 ? "single" : "partial"

    const run = await db.workflowRun.create({
      data: {
        workflowId: workflow.id,
        userId: user.id,
        status: "running",
        scope: normalizedScope,
      },
    })

    await enqueueWorkflowRunTask({
      runId: run.id,
      workflowId: workflow.id,
      userId: user.id,
      nodes,
      edges,
      mode: mode === "partial" ? "selected" : mode,
      selectedNodeIds,
    })

    return NextResponse.json({ runId: run.id, status: "started" }, { status: 201 })
  } catch (error) {
    console.error("POST execute error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
