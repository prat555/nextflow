"use client"

import { BaseEdge, getBezierPath, type EdgeProps } from "@xyflow/react"
import { useMemo } from "react"
import { useWorkflowStore } from "./workflow-store"

export function WorkflowEdge(props: EdgeProps) {
  const { id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style, markerEnd, data } = props
  const runningNodeIds = useWorkflowStore((s) => s.runningNodeIds)

  const shouldAnimate = useMemo(() => {
    // Animate when either endpoint is currently executing.
    // This gives a “flowing dots” feel during the mock run.
    return runningNodeIds.has(props.source) || runningNodeIds.has(props.target)
  }, [runningNodeIds, props.source, props.target])

  const [d] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  })

  const baseStyle: React.CSSProperties = {
    stroke: "#3b82f6",
    strokeWidth: 2,
  }

  const animStyle: React.CSSProperties = shouldAnimate
    ? {
        strokeDasharray: "6 10",
        strokeDashoffset: 0,
        animation: "workflow-edge-flow 1s linear infinite",
      }
    : {}

  return (
    <BaseEdge
      id={id}
      path={d}
      markerEnd={markerEnd}
      style={{ ...baseStyle, ...style, ...animStyle }}
      className={shouldAnimate ? "opacity-95" : "opacity-90"}
    />
  )
}

export const workflowEdgeTypes = {
  workflow: WorkflowEdge,
}

