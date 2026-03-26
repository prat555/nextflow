import { useEffect, useState } from "react"

type Workflow = {
  id: string
  name: string
  createdAt: Date
  updatedAt: Date
}

export function useWorkflows() {
  const [workflows, setWorkflows] = useState<Workflow[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const res = await fetch("/api/workflows")
        if (!res.ok) throw new Error("Failed to fetch workflows")
        const data = await res.json()
        setWorkflows(
          (data.workflows || []).map((w: any) => ({
            ...w,
            createdAt: new Date(w.createdAt),
            updatedAt: new Date(w.updatedAt),
          })),
        )
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error")
      } finally {
        setLoading(false)
      }
    }

    fetchWorkflows()
  }, [])

  const createWorkflow = async (name = "Untitled") => {
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      })
      if (!res.ok) throw new Error("Failed to create workflow")
      const data = await res.json()
      const workflow = {
        ...data.workflow,
        createdAt: new Date(data.workflow.createdAt),
        updatedAt: new Date(data.workflow.updatedAt),
      }
      setWorkflows((prev) => [workflow, ...prev])
      return workflow
    } catch (err) {
      throw err
    }
  }

  return { workflows, loading, error, createWorkflow }
}
