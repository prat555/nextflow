import { create } from "zustand"
import type { Edge, Node } from "@xyflow/react"

import type {
  CanvasMode,
  InvalidConnectionFlash,
  NodeKind,
  ToolMode,
  WorkflowHistoryEntry,
  WorkflowNodeData,
  WorkflowSnapshot,
} from "./types"

type WorkflowState = {
  nodes: Node<any>[]
  edges: Edge<any>[]

  history: WorkflowHistoryEntry[]

  canvasMode: CanvasMode
  toolMode: ToolMode
  sidebarExpanded: boolean
  historyPanelOpen: boolean
  selectedNodeIds: string[]
  workflowName: string
  isExecuting: boolean

  runningNodeIds: Set<string>
  invalidFlash: InvalidConnectionFlash

  undoStack: WorkflowSnapshot[]
  redoStack: WorkflowSnapshot[]

  setNodesEdges: (nodes: Node<any>[], edges: Edge<any>[]) => void
  setSelectedNodeIds: (ids: string[]) => void
  toggleCanvasMode: () => void
  setToolMode: (toolMode: ToolMode) => void
  toggleSidebar: () => void
  setHistoryPanelOpen: (open: boolean) => void
  setWorkflowName: (name: string) => void
  setIsExecuting: (executing: boolean) => void

  flashInvalid: (flash: InvalidConnectionFlash) => void

  commitSnapshot: () => void
  undo: () => void
  redo: () => void

  addNode: (kind: NodeKind, position: { x: number; y: number }) => void
  removeNode: (nodeId: string) => void
  removeEdge: (edgeId: string) => void
  updateNodeData: (nodeId: string, data: Partial<WorkflowNodeData>) => void
  replaceCanvas: (nodes: Node<any>[], edges: Edge<any>[]) => void

  addHistoryEntry: (entry: WorkflowHistoryEntry) => void
  setHistoryEntries: (entries: WorkflowHistoryEntry[]) => void

  resetExecution: () => void
  setRunningNodes: (nodeIds: string[], running: boolean) => void
}

const defaultNodeExecution = (): WorkflowNodeData["execution"] => "idle"

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],

  history: [],

  canvasMode: "dark",
  toolMode: "select",
  sidebarExpanded: false,
  historyPanelOpen: false,
  selectedNodeIds: [],
  workflowName: "Untitled",
  isExecuting: false,

  runningNodeIds: new Set<string>(),
  invalidFlash: null,

  undoStack: [],
  redoStack: [],

  setNodesEdges: (nodes, edges) => set({ nodes, edges }),

  setSelectedNodeIds: (ids) => set({ selectedNodeIds: ids }),

  toggleCanvasMode: () => set({ canvasMode: get().canvasMode === "dark" ? "light" : "dark" }),

  setToolMode: (toolMode) => set({ toolMode }),
  toggleSidebar: () => set({ sidebarExpanded: !get().sidebarExpanded }),
  setHistoryPanelOpen: (open) => set({ historyPanelOpen: open }),
  setWorkflowName: (name) => set({ workflowName: name.trim() || "Untitled" }),
  setIsExecuting: (executing) => set({ isExecuting: executing }),

  flashInvalid: (flash) => set({ invalidFlash: flash }),

  commitSnapshot: () => {
    const { nodes, edges, history, undoStack } = get()
    const snapshot: WorkflowSnapshot = {
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
      history: structuredClone(history),
    }
    set({ undoStack: [...undoStack, snapshot], redoStack: [] })
  },

  undo: () => {
    const { undoStack, redoStack, nodes, edges, history } = get()
    if (undoStack.length === 0) return

    const previous = undoStack[undoStack.length - 1]
    const nextUndo = undoStack.slice(0, undoStack.length - 1)

    const currentSnapshot: WorkflowSnapshot = {
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
      history: structuredClone(history),
    }

    set({
      nodes: structuredClone(previous.nodes) as any,
      edges: structuredClone(previous.edges) as any,
      history: structuredClone(previous.history) as any,
      undoStack: nextUndo,
      redoStack: [...redoStack, currentSnapshot],
      invalidFlash: null,
      runningNodeIds: new Set<string>(),
    })
  },

  redo: () => {
    const { redoStack, undoStack, nodes, edges, history } = get()
    if (redoStack.length === 0) return

    const next = redoStack[redoStack.length - 1]
    const nextRedo = redoStack.slice(0, redoStack.length - 1)

    const currentSnapshot: WorkflowSnapshot = {
      nodes: structuredClone(nodes),
      edges: structuredClone(edges),
      history: structuredClone(history),
    }

    set({
      nodes: structuredClone(next.nodes) as any,
      edges: structuredClone(next.edges) as any,
      history: structuredClone(next.history) as any,
      redoStack: nextRedo,
      undoStack: [...undoStack, currentSnapshot],
      invalidFlash: null,
      runningNodeIds: new Set<string>(),
    })
  },

  addNode: (kind, position) => {
    const id = crypto.randomUUID()
    const base = { execution: defaultNodeExecution() }

    let data: WorkflowNodeData
    switch (kind) {
      case "text":
        data = { kind, text: "", ...base }
        break
      case "uploadImage":
        data = { kind, imageUrl: undefined, ...base }
        break
      case "uploadVideo":
        data = { kind, videoUrl: undefined, ...base }
        break
      case "llm":
        data = {
          kind,
          systemPrompt: "",
          userMessage: "",
          imageUrls: [],
          modelId: "gemini-2.5-flash-lite",
          ...base,
        }
        break
      case "cropImage":
        data = { kind, imageUrl: undefined, x_percent: 0, y_percent: 0, width_percent: 100, height_percent: 100, croppedUrl: undefined, ...base }
        break
      case "extractFrame":
        data = { kind, videoUrl: undefined, timestamp: "0", frameUrl: undefined, ...base }
        break
      default: {
        // Should be unreachable because NodeKind is a union
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        data = { kind: "text", text: "", ...base } as any
      }
    }

    set((state) => ({
      nodes: [
        ...state.nodes,
        {
          id,
          type: kind,
          position,
          data,
          selected: false,
        },
      ],
    }))
  },

  removeNode: (nodeId) => {
    set((state) => ({
      nodes: state.nodes.filter((n) => n.id !== nodeId),
      edges: state.edges.filter((e: any) => e.source !== nodeId && e.target !== nodeId),
      selectedNodeIds: state.selectedNodeIds.filter((id) => id !== nodeId),
    }))
  },

  removeEdge: (edgeId) => {
    set((state) => ({
      edges: state.edges.filter((e: any) => e.id !== edgeId),
    }))
  },

  updateNodeData: (nodeId, data) => {
    set((state) => ({
      nodes: state.nodes.map((n) => {
        if (n.id !== nodeId) return n
        return {
          ...n,
          data: {
            ...n.data,
            ...data,
          },
        }
      }),
    }))
  },

  replaceCanvas: (nodes, edges) => set({ nodes, edges }),

  addHistoryEntry: (entry) => set((state) => ({ history: [entry, ...state.history] })),

  setHistoryEntries: (entries) => set({ history: entries }),

  resetExecution: () => {
    set((state) => ({
      nodes: state.nodes.map((n) => ({ ...n, data: { ...n.data, execution: "idle" } })),
      runningNodeIds: new Set<string>(),
    }))
  },

  setRunningNodes: (nodeIds, running) => {
    set((state) => {
      const runningSet = new Set<string>(state.runningNodeIds)
      for (const id of nodeIds) {
        if (running) runningSet.add(id)
        else runningSet.delete(id)
      }

      return {
        runningNodeIds: runningSet,
        nodes: state.nodes.map((n) => {
          if (!nodeIds.includes(n.id)) return n
          const currentExecution = n.data.execution
          return {
            ...n,
            data: {
              ...n.data,
              execution: running ? "running" : currentExecution === "running" ? "idle" : currentExecution,
            },
          }
        }),
      }
    })
  },
}))

