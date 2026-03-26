import { task } from "@trigger.dev/sdk"
import { GoogleGenerativeAI } from "@google/generative-ai"

export type LlmTaskPayload = {
  model: string
  systemPrompt?: string
  userMessage: string
  images?: string[]
}

function normalizeGeminiModel(model: string | undefined) {
  const value = String(model ?? "gemini-2.5-flash-lite").trim()
  if (!value) return "gemini-2.5-flash-lite"
  return value.startsWith("models/") ? value.replace(/^models\//, "") : value
}

function isLikelyQuotaError(error: unknown) {
  const text = error instanceof Error ? error.message : String(error)
  const normalized = text.toLowerCase()
  return normalized.includes("quota") || normalized.includes("resource_exhausted") || normalized.includes("429")
}

function ensureUserMessage(message: string | undefined): string {
  const normalized = String(message ?? "").trim()
  return normalized || "Describe what you see."
}

async function fallbackWithOpenRouter(payload: LlmTaskPayload) {
  const openRouterKey = process.env.OPENROUTER_API_KEY
  if (!openRouterKey) {
    console.error("[llm-task] Missing required env var: OPENROUTER_API_KEY")
    throw new Error("OPENROUTER_API_KEY is not set in Trigger.dev environment variables")
  }

  const fallbackModel = process.env.OPENROUTER_FALLBACK_MODEL || "meta-llama/llama-3.3-8b-instruct:free"
  const imageContext = Array.isArray(payload.images) && payload.images.length > 0
    ? `\n\nImage URLs:\n${payload.images.join("\n")}`
    : ""

  const systemPrompt = payload.systemPrompt?.trim() || "You are a helpful assistant."
  const userPrompt = `${payload.userMessage || ""}${imageContext}`

  const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${openRouterKey}`,
      "Content-Type": "application/json",
      "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
      "X-Title": "NextFlow",
    },
    body: JSON.stringify({
      model: fallbackModel,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.6,
    }),
  })

  if (!response.ok) {
    const body = await response.text().catch(() => "")
    throw new Error(`OpenRouter failed (${response.status})${body ? `: ${body}` : ""}`)
  }

  const json = (await response.json()) as any
  const content = json?.choices?.[0]?.message?.content
  if (!content || typeof content !== "string") {
    throw new Error("OpenRouter returned an empty or invalid response")
  }

  return content
}

export const llmTask = task({
  id: "llm-task",
  run: async (payload: LlmTaskPayload): Promise<string> => {
    const userMessage = ensureUserMessage(payload.userMessage)
    const normalizedPayload: LlmTaskPayload = {
      ...payload,
      userMessage,
    }

    const apiKey = process.env.GOOGLE_AI_API_KEY
    if (!apiKey) {
      console.warn("[llm-task] GOOGLE_AI_API_KEY not set. Falling back to OpenRouter.")
      return fallbackWithOpenRouter(normalizedPayload)
    }

    const client = new GoogleGenerativeAI(apiKey)
    const model = client.getGenerativeModel({
      model: normalizeGeminiModel(payload.model),
      systemInstruction: payload.systemPrompt,
    })

    const parts = []

    // Add images if provided (vision support)
    if (Array.isArray(payload.images) && payload.images.length > 0) {
      for (const imageUrl of payload.images) {
        try {
          // Fetch image and convert to base64
          const response = await fetch(imageUrl)
          if (!response.ok) continue
          const buffer = await response.arrayBuffer()
          const base64 = Buffer.from(buffer).toString("base64")
          const mimeType = response.headers.get("content-type") || "image/jpeg"
          parts.push({
            inlineData: { data: base64, mimeType },
          })
        } catch {
          // Skip failed image fetch
        }
      }
    }

    // Add text message
    parts.push({ text: userMessage })

    try {
      const result = await model.generateContent({ contents: [{ role: "user", parts }] })
      const text = result.response.text() || ""
      if (text.trim().length > 0) return text
      return fallbackWithOpenRouter(normalizedPayload)
    } catch (error) {
      const details = error instanceof Error ? error.message : String(error)
      console.error(`[llm-task] Gemini request failed: ${details}`)
      if (isLikelyQuotaError(error)) {
        return fallbackWithOpenRouter(normalizedPayload)
      }
      return fallbackWithOpenRouter(normalizedPayload)
    }
  },
})

export async function runLlmTask(payload: LlmTaskPayload): Promise<string> {
  const result = (await llmTask.triggerAndWait(payload)) as any
  if (!result?.ok) {
    throw new Error(result?.error?.message ?? "Unable to fetch output")
  }
  return String(result.output ?? "")
}
