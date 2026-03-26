import { auth } from "@clerk/nextjs/server"
import { db } from "./db"

export async function getCurrentUser() {
  const { userId } = await auth()
  if (!userId) return null

  let user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  return user
}

export async function getCurrentUserId() {
  const user = await getCurrentUser()
  return user?.id || null
}

export async function ensureUserExists(clerkId: string, email?: string, name?: string) {
  let user = await db.user.findUnique({
    where: { clerkId },
  })

  if (!user) {
    user = await db.user.create({
      data: {
        clerkId,
        email: email || `${clerkId}@clerk.local`,
        name: name || undefined,
      },
    })
  }

  return user
}
