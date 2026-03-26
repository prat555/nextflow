import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { db } from "@/lib/db"
import { ensureUserExists } from "@/lib/auth"

export async function GET(_request: Request) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await ensureUserExists(clerkId)
    const workflows = await db.workflow.findMany({
      where: { userId: user.id },
      select: { id: true, name: true, createdAt: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    })

    return NextResponse.json({ workflows })
  } catch (error) {
    console.error("GET workflows error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth()
    if (!clerkId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const user = await ensureUserExists(clerkId)
    const body = await request.json().catch(() => ({}))
    const name = typeof body?.name === "string" ? body.name : "Untitled"
    const nodes = Array.isArray(body?.nodes) ? body.nodes : []
    const edges = Array.isArray(body?.edges) ? body.edges : []

    const workflow = await db.workflow.create({
      data: {
        userId: user.id,
        name,
        nodes,
        edges,
      },
    })

    return NextResponse.json({ workflow }, { status: 201 })
  } catch (error) {
    console.error("POST workflows error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
