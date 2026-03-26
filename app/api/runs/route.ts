import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { ensureUserExists } from "@/lib/auth"
import type { Edge, Node } from "@xyflow/react"
import { enqueueWorkflowRunTask } from "@/trigger/workflow-run-task"

export async function GET(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await ensureUserExists(clerkId)
    const { searchParams } = new URL(request.url)
    const workflowId = searchParams.get("workflowId")

    if (!workflowId) {
      return NextResponse.json({ error: "workflowId is required" }, { status: 400 })
    }

    const runs = await db.workflowRun.findMany({
      where: { userId: user.id, workflowId },
      include: { nodeRuns: true },
      orderBy: { startedAt: "desc" },
      take: 50,
    })

    return NextResponse.json({ runs })
  } catch (error) {
    console.error("GET runs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await ensureUserExists(clerkId)
    const body = await request.json().catch(() => ({}))
    const workflowId = String(body?.workflowId ?? "")
    const mode = body?.mode === "single" || body?.mode === "selected" ? body.mode : "full"
    const selectedNodeIds = Array.isArray(body?.selectedNodeIds) ? body.selectedNodeIds : []

    if (!workflowId) {
      return NextResponse.json({ error: "workflowId is required" }, { status: 400 })
    }

    // Fetch workflow
    const workflow = await db.workflow.findFirst({ where: { id: workflowId, userId: user.id } })
    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    const run = await db.workflowRun.create({
      data: {
        workflowId,
        userId: user.id,
        status: "running",
        scope: mode === "full" ? "full" : mode === "single" || selectedNodeIds.length <= 1 ? "single" : "partial",
      },
    })

    const nodes = workflow.nodes as unknown as Node[]
    const edges = workflow.edges as unknown as Edge[]

    try {
      await enqueueWorkflowRunTask({
        runId: run.id,
        workflowId,
        userId: user.id,
        nodes,
        edges,
        mode,
        selectedNodeIds,
      })
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      await db.workflowRun.update({
        where: { id: run.id },
        data: {
          status: "failed",
          error: `Failed to enqueue Trigger.dev run: ${message}`,
          completedAt: new Date(),
        },
      })
      return NextResponse.json({ error: "Failed to enqueue workflow run" }, { status: 500 })
    }

    return NextResponse.json({ runId: run.id }, { status: 201 })
  } catch (error) {
    console.error("POST runs error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
