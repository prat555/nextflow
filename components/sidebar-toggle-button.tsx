"use client"

import { LayoutGrid } from "lucide-react"

type SidebarToggleButtonProps = {
  onClick: () => void
  className?: string
}

export function SidebarToggleButton({ onClick, className = "" }: SidebarToggleButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-[#1a1a1a] text-[#888] hover:text-white transition-colors flex-shrink-0 ${className}`.trim()}
    >
      <LayoutGrid className="w-4 h-4" />
    </button>
  )
}
