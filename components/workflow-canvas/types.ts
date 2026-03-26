export type CanvasMode = "dark" | "light"

export type OutputType = "text" | "image" | "video"

export type NodeKind = "text" | "uploadImage" | "uploadVideo" | "llm" | "cropImage" | "extractFrame"

export type InputHandleType =
  | "system_prompt"
  | "user_message"
  | "images"
  | "image_url"
  | "x_percent"
  | "y_percent"
  | "width_percent"
  | "height_percent"
  | "video_url"
  | "timestamp"

export type OutputHandleType = "text_out" | "image_out" | "video_out"

export type LlmModelId =
  | "gemini-2.5-pro"
  | "gemini-2.5-flash"
  | "gemini-2.5-flash-lite"
  | "gemini-2.0-flash"
  | "gemini-2.0-flash-001"
  | "gemini-2.0-flash-lite"
  | "gemini-2.0-flash-lite-001"
  // Legacy values kept for backwards compatibility with older saved workflows.
  | "models/gemini-2.5-pro"
  | "models/gemini-2.5-flash"
  | "models/gemini-2.5-flash-lite"
  | "models/gemini-2.0-flash"
  | "models/gemini-2.0-flash-001"
  | "models/gemini-2.0-flash-lite"
  | "models/gemini-2.0-flash-lite-001"

export type BaseNodeData = {
  kind: NodeKind
  execution: "idle" | "running" | "executed" | "failed"
  outputText?: string
  errorMessage?: string
  resultPreview?: string
}

export type TextNodeData = BaseNodeData & {
  kind: "text"
  text: string
}

export type UploadImageNodeData = BaseNodeData & {
  kind: "uploadImage"
  imageUrl?: string
}

export type UploadVideoNodeData = BaseNodeData & {
  kind: "uploadVideo"
  videoUrl?: string
}

export type LlmNodeData = BaseNodeData & {
  kind: "llm"
  systemPrompt: string
  userMessage: string
  imageUrls: string[]
  modelId: LlmModelId
}

export type CropImageNodeData = BaseNodeData & {
  kind: "cropImage"
  imageUrl?: string
  x_percent: number
  y_percent: number
  width_percent: number
  height_percent: number
  croppedUrl?: string
}

export type ExtractFrameNodeData = BaseNodeData & {
  kind: "extractFrame"
  videoUrl?: string
  timestamp: string
  frameUrl?: string
}

export type WorkflowNodeData = TextNodeData | UploadImageNodeData | UploadVideoNodeData | LlmNodeData | CropImageNodeData | ExtractFrameNodeData

export type InvalidConnectionFlash = {
  sourceNodeId: string
  sourceHandleId: string
  targetNodeId: string
  targetHandleId: string
} | null

export type WorkflowSnapshot = {
  nodes: any[]
  edges: any[]
  history: any[]
}

export type WorkflowRunStatus = "success" | "failed" | "partial" | "running"

export type WorkflowScopeLabel = "Full Workflow" | "Partial" | "Single Node"

export type WorkflowHistoryNodeDetail = {
  nodeId: string
  nodeName: string
  durationMs: number
  status: "success" | "failed" | "running"
  outputPreview?: string
  error?: string
}

export type WorkflowHistoryEntry = {
  id: string
  timestamp: string
  status: WorkflowRunStatus
  durationMs: number
  scope: WorkflowScopeLabel
  nodeDetails: WorkflowHistoryNodeDetail[]
}

export type ToolMode = "select" | "pan" | "cut"

export type NodeNameByKind = Record<NodeKind, string>

export const nodeNameByKind: NodeNameByKind = {
  text: "Text Node",
  uploadImage: "Upload Image",
  uploadVideo: "Upload Video",
  llm: "LLM Node",
  cropImage: "Crop Image",
  extractFrame: "Extract Frame",
}

export type EdgeData = {
  // Used by the edge renderer to animate “flow dots”
  typeTag: OutputType | null
}

