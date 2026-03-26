import { createHmac } from "crypto"

type AssemblyResultFile = {
  ssl_url?: string
  url?: string
}

type AssemblyStatusResponse = {
  ok?: string
  error?: string
  results?: Record<string, AssemblyResultFile[]>
  assembly_ssl_url?: string
}

function getAuth() {
  const key = process.env.TRANSLOADIT_AUTH_KEY?.trim()
  const secret = process.env.TRANSLOADIT_AUTH_SECRET?.trim()
  if (!key || !secret) {
    console.error("[transloadit-task] Missing env vars:", {
      TRANSLOADIT_AUTH_KEY: Boolean(key),
      TRANSLOADIT_AUTH_SECRET: Boolean(secret),
    })
    throw new Error("Transloadit credentials are missing")
  }
  return { key, secret }
}

function signParams(paramsJson: string, secret: string) {
  const digest = createHmac("sha384", secret).update(paramsJson).digest("hex")
  return `sha384:${digest}`
}

function buildAuthParams(key: string) {
  const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()
  return {
    key,
    expires,
  }
}

export async function runTransloaditAssembly(steps: Record<string, unknown>, resultStep: string): Promise<string> {
  const { key, secret } = getAuth()
  const paramsObj = {
    auth: buildAuthParams(key),
    steps,
  }
  const params = JSON.stringify(paramsObj)
  const signature = signParams(params, secret)

  const body = new URLSearchParams()
  body.set("params", params)
  body.set("signature", signature)

  const startRes = await fetch("https://api2.transloadit.com/assemblies", {
    method: "POST",
    body,
  })

  if (!startRes.ok) {
    const responseText = await startRes.text().catch(() => "")
    throw new Error(
      `Failed to create Transloadit assembly (${startRes.status})${responseText ? `: ${responseText}` : ""}`
    )
  }

  const started = (await startRes.json()) as AssemblyStatusResponse
  if (!started.assembly_ssl_url) {
    throw new Error("Transloadit did not return assembly URL")
  }

  const startedAt = Date.now()
  const timeoutMs = 2 * 60 * 1000

  while (Date.now() - startedAt < timeoutMs) {
    const statusRes = await fetch(started.assembly_ssl_url)
    if (!statusRes.ok) {
      await new Promise((r) => setTimeout(r, 1000))
      continue
    }

    const status = (await statusRes.json()) as AssemblyStatusResponse
    if (status.ok === "ASSEMBLY_COMPLETED") {
      const files = status.results?.[resultStep] ?? []
      const first = files[0]
      const url = first?.ssl_url ?? first?.url
      if (!url) {
        throw new Error("Transloadit completed but no output file URL was returned")
      }
      return url
    }

    if (status.error || status.ok === "ASSEMBLY_EXECUTING" || status.ok === "ASSEMBLY_UPLOADING") {
      await new Promise((r) => setTimeout(r, 1000))
      continue
    }
  }

  throw new Error("Transloadit assembly timed out")
}
