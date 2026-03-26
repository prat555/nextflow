import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { ensureUserExists } from "@/lib/auth"

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await ensureUserExists(clerkId)
    const workflow = await db.workflow.findFirst({
      where: { id, userId: user.id },
      include: {
        runs: {
          orderBy: { startedAt: "desc" },
          take: 50,
          include: {
            nodeRuns: {
              orderBy: { id: "asc" },
            },
          },
        },
      },
    })

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    return NextResponse.json({ workflow })
  } catch (error) {
    console.error("GET workflow error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await ensureUserExists(clerkId)
    const workflow = await db.workflow.findFirst({ where: { id, userId: user.id } })

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    const body = await request.json().catch(() => ({}))
    const name = typeof body?.name === "string" ? body.name : workflow.name
    const nodes = Array.isArray(body?.nodes) ? body.nodes : workflow.nodes
    const edges = Array.isArray(body?.edges) ? body.edges : workflow.edges

    const updated = await db.workflow.update({
      where: { id },
      data: {
        name,
        nodes,
        edges,
        updatedAt: new Date(),
      },
    })

    return NextResponse.json({ workflow: updated })
  } catch (error) {
    console.error("PUT workflow error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await ensureUserExists(clerkId)
    const workflow = await db.workflow.findFirst({ where: { id, userId: user.id } })

    if (!workflow) {
      return NextResponse.json({ error: "Workflow not found" }, { status: 404 })
    }

    await db.workflow.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("DELETE workflow error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
