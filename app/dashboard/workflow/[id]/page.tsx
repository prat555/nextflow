import { WorkflowCanvasEditor } from "@/components/workflow-canvas/workflow-canvas-editor"

export default async function WorkflowCanvasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return <WorkflowCanvasEditor workflowId={id} />
}

