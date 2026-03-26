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
    const run = await db.workflowRun.findUnique({
      where: { id },
      include: {
        nodeRuns: {
          orderBy: { id: "asc" },
        },
      },
    })

    if (!run || run.userId !== user.id) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 })
    }

    return NextResponse.json({
      ...run,
      run: {
        ...run,
        nodeRuns: run.nodeRuns,
      },
    })
  } catch (error) {
    console.error("GET run error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
