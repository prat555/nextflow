import { task } from "@trigger.dev/sdk"
import { runTransloaditAssembly } from "./transloadit"

export type ExtractFrameTaskPayload = {
  videoUrl: string
  timestamp: string
}

function addCacheBuster(url: string): string {
  const token = Date.now().toString()

  try {
    const parsed = new URL(url)
    parsed.searchParams.set("t", token)
    return parsed.toString()
  } catch {
    const separator = url.includes("?") ? "&" : "?"
    return `${url}${separator}t=${token}`
  }
}

function normalizeTimestamp(value: string): string {
  const raw = value.trim()
  if (!raw) return "0"

  if (raw.endsWith("%")) {
    const pct = Number(raw.slice(0, -1))
    if (!Number.isFinite(pct)) return "0"
    const clamped = Math.max(0, Math.min(100, pct))
    return `${clamped}%`
  }

  const seconds = Number(raw)
  if (!Number.isFinite(seconds)) return "0"
  return `${Math.max(0, seconds)}`
}

export const extractFrameTask = task({
  id: "extract-frame-task",
  run: async (payload: ExtractFrameTaskPayload): Promise<string> => {
    const videoUrl = payload.videoUrl.trim()
    if (!videoUrl) {
      throw new Error("videoUrl is required")
    }

    if (!/^https?:\/\//i.test(videoUrl)) {
      throw new Error("Valid videoUrl is required")
    }

    const timestamp = normalizeTimestamp(payload.timestamp)

    const steps = {
      import: {
        robot: "/http/import",
        url: addCacheBuster(videoUrl),
      },
      // Re-encode first to increase keyframe density, then extract.
      // This improves timestamp accuracy for /video/thumbs on videos with sparse keyframes.
      encode: {
        robot: "/video/encode",
        use: "import",
        preset: "ipad-high",
      },
      frame: {
        robot: "/video/thumbs",
        use: "encode",
        count: 1,
        format: "jpg",
        from: timestamp,
      },
    }

    try {
      return await runTransloaditAssembly(steps, "frame")
    } catch {
      return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='320' height='180'%3E%3Crect fill='%23333' width='320' height='180'/%3E%3Ctext x='50%25' y='50%25' fill='%23999' text-anchor='middle' dominant-baseline='middle'%3EFrame unavailable%3C/text%3E%3C/svg%3E`
    }
  },
})

export async function runExtractFrameTask(payload: ExtractFrameTaskPayload): Promise<string> {
  const result = (await extractFrameTask.triggerAndWait(payload)) as any
  if (!result?.ok) {
    throw new Error(result?.error?.message ?? "Extract frame task failed")
  }
  return String(result.output ?? "")
}
