import { auth } from "@clerk/nextjs/server"
import { redirect } from "next/navigation"

export default async function SignInPage() {
  const { userId } = await auth()

  if (userId) {
    redirect("/dashboard")
  }

  redirect("/?auth=signin")
}
