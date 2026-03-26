import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function SignUpPage() {
  const { userId } = await auth()

  if (userId) {
    redirect("/dashboard")
  }

  redirect("/?auth=signup")
}
