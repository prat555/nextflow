import { NextResponse } from "next/server"
import { auth } from "@clerk/nextjs/server"
import { createHmac } from "crypto"

function createSignature(params: string, secret: string) {
  const digest = createHmac("sha384", secret).update(params).digest("hex")
  return `sha384:${digest}`
}

export async function POST() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const key = process.env.TRANSLOADIT_AUTH_KEY?.trim()
    const secret = process.env.TRANSLOADIT_AUTH_SECRET?.trim()

    if (!key || !secret) {
      console.error("[transloadit-sign-route] Missing env vars:", {
        TRANSLOADIT_AUTH_KEY: Boolean(key),
        TRANSLOADIT_AUTH_SECRET: Boolean(secret),
      })
      return NextResponse.json({ error: "Transloadit credentials are missing" }, { status: 500 })
    }

    // Common misconfiguration: placeholder/project labels are used instead of the actual Transloadit auth key.
    if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{5,}$/.test(key)) {
      return NextResponse.json(
        {
          error: "Invalid Transloadit auth key format",
          hint: "Set TRANSLOADIT_AUTH_KEY to your real key from the Transloadit account settings.",
        },
        { status: 500 }
      )
    }

    const paramsObject = {
      auth: {
        key,
        expires: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      },
      steps: {
        ":original": {
          robot: "/upload/handle",
          result: true,
        },
      },
    }

    const params = JSON.stringify(paramsObject)
    const signature = createSignature(params, secret)

    return NextResponse.json({ params, signature })
  } catch (error) {
    console.error("Transloadit sign route error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
