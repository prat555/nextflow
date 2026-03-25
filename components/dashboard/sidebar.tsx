"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Home,
  Sparkles,
  GitBranch,
  Folder,
  Image,
  Video,
  Wand2,
  Zap,
  Type,
  Mic,
  PersonStanding,
  Circle,
  Film,
  Square,
} from "lucide-react"
import { useState } from "react"

const mainNav = [
  { name: "Home", href: "/dashboard", icon: Home, iconColor: "text-gray-400" },
  { name: "Train Lora", href: "/dashboard/train-lora", icon: Sparkles, iconColor: "text-orange-400" },
  { name: "Node Editor", href: "/dashboard/node-editor", icon: GitBranch, iconColor: "text-blue-400" },
  { name: "Assets", href: "/dashboard/assets", icon: Folder, iconColor: "text-blue-400" },
]

const tools = [
  { name: "Image", href: "/dashboard/image", icon: Image, iconColor: "text-blue-400", bgColor: "bg-blue-500/20" },
  { name: "Video", href: "/dashboard/video", icon: Video, iconColor: "text-orange-400", bgColor: "bg-orange-500/20" },
  { name: "Enhancer", href: "/dashboard/enhancer", icon: Wand2, iconColor: "text-gray-400", bgColor: "bg-gray-500/20" },
  { name: "Nano Banana", href: "/dashboard/nano-banana", icon: () => <span className="text-sm">🌙</span>, iconColor: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  { name: "Realtime", href: "/dashboard/realtime", icon: Zap, iconColor: "text-blue-400", bgColor: "bg-blue-500/20" },
  { name: "Edit", href: "/dashboard/edit", icon: Type, iconColor: "text-purple-400", bgColor: "bg-purple-500/20" },
  { name: "Video Lipsync", href: "/dashboard/video-lipsync", icon: Mic, iconColor: "text-gray-500", bgColor: "bg-gray-600/20" },
  { name: "Motion Transfer", href: "/dashboard/motion-transfer", icon: PersonStanding, iconColor: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  { name: "3D Objects", href: "/dashboard/3d-objects", icon: Circle, iconColor: "text-gray-400", bgColor: "bg-gray-500/20" },
  { name: "Video Restyle", href: "/dashboard/video-restyle", icon: Film, iconColor: "text-green-400", bgColor: "bg-green-500/20" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [showAllTools, setShowAllTools] = useState(false)

  const visibleTools = showAllTools ? tools : tools.slice(0, 6)

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#0a0a0a] flex flex-col transition-all duration-300 z-50 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Collapse button */}
      <div className="p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-8 h-8 flex items-center justify-center hover:bg-[#1a1a1a] rounded-lg transition-colors text-gray-400 hover:text-white border border-gray-700"
        >
          <Square className="w-4 h-4" />
        </button>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
        {mainNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-[#1a1a1a] text-white"
                  : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
              }`}
            >
              <item.icon className={`w-4 h-4 flex-shrink-0 ${item.iconColor}`} />
              {!collapsed && <span className="text-sm">{item.name}</span>}
            </Link>
          )
        })}

        {/* Tools section */}
        {!collapsed && (
          <p className="text-[11px] text-[#555] tracking-wider px-3 pt-6 pb-2">
            Tools
          </p>
        )}
        {collapsed && <div className="h-6" />}

        <div className={`space-y-0.5 transition-all duration-300 ${showAllTools ? "" : ""}`}>
          {visibleTools.map((item) => {
            const isActive = pathname === item.href
            const IconComponent = item.icon
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? "bg-[#1a1a1a] text-white"
                    : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                }`}
              >
                <div className={`w-5 h-5 rounded flex items-center justify-center ${item.bgColor}`}>
                  {typeof IconComponent === 'function' && IconComponent.name === '' ? (
                    <IconComponent />
                  ) : (
                    <IconComponent className={`w-3 h-3 ${item.iconColor}`} />
                  )}
                </div>
                {!collapsed && <span className="text-sm">{item.name}</span>}
              </Link>
            )
          })}
        </div>

        {/* More/Less toggle */}
        {!collapsed && (
          <button 
            onClick={() => setShowAllTools(!showAllTools)}
            className="flex items-center gap-2 px-3 py-2 text-[#555] hover:text-gray-300 transition-colors w-full"
          >
            <span className="text-sm tracking-wider">...</span>
            <span className="text-sm">{showAllTools ? "Less" : "More"}</span>
          </button>
        )}

        {/* Sessions section */}
        {!collapsed && (
          <p className="text-[11px] text-[#555] tracking-wider px-3 pt-6 pb-2">
            Sessions
          </p>
        )}
        {collapsed && <div className="h-6" />}

        {/* User in Sessions */}
        <div className={`flex items-center gap-3 px-3 py-2 ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">awesomeimpeccabl...</p>
              <p className="text-xs text-[#555]">Free</p>
            </div>
          )}
        </div>
      </nav>
    </aside>
  )
}
