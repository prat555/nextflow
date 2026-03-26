import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

import { ensureUserExists } from "@/lib/auth"
import { db } from "@/lib/db"

export const dynamic = "force-dynamic"

export default async function NewWorkflowPage() {
  const { userId: clerkId } = await auth()
  if (!clerkId) {
    redirect("/sign-in")
  }

  const user = await ensureUserExists(clerkId)
  const workflow = await db.workflow.create({
    data: {
      userId: user.id,
      name: "Untitled",
      nodes: [],
      edges: [],
    },
    select: { id: true },
  })

  redirect(`/dashboard/workflow/${workflow.id}`)
}

