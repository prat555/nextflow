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
  Banana,
  Zap,
  Type,
  MoreHorizontal,
  PanelLeftClose,
  PanelLeft,
  Gift,
} from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"

const mainNav = [
  { name: "Home", href: "/dashboard", icon: Home },
  { name: "Train Lora", href: "/dashboard/train-lora", icon: Sparkles, iconColor: "text-orange-400" },
  { name: "Node Editor", href: "/dashboard/node-editor", icon: GitBranch, iconColor: "text-blue-400" },
  { name: "Assets", href: "/dashboard/assets", icon: Folder, iconColor: "text-yellow-400" },
]

const tools = [
  { name: "Image", href: "/dashboard/image", icon: Image, iconColor: "text-blue-400", bgColor: "bg-blue-500/20" },
  { name: "Video", href: "/dashboard/video", icon: Video, iconColor: "text-orange-400", bgColor: "bg-orange-500/20" },
  { name: "Enhancer", href: "/dashboard/enhancer", icon: Wand2, iconColor: "text-pink-400", bgColor: "bg-pink-500/20" },
  { name: "Nano Banana", href: "/dashboard/nano-banana", icon: Banana, iconColor: "text-yellow-400", bgColor: "bg-yellow-500/20" },
  { name: "Realtime", href: "/dashboard/realtime", icon: Zap, iconColor: "text-blue-400", bgColor: "bg-blue-500/20" },
  { name: "Edit", href: "/dashboard/edit", icon: Type, iconColor: "text-red-400", bgColor: "bg-red-500/20" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <aside
      className={`fixed left-0 top-0 h-screen bg-[#0a0a0a] border-r border-white/10 flex flex-col transition-all duration-300 z-50 ${
        collapsed ? "w-16" : "w-60"
      }`}
    >
      {/* Collapse button */}
      <div className="p-3">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 hover:bg-white/5 rounded-lg transition-colors text-gray-400 hover:text-white"
        >
          {collapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
        </button>
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 space-y-1">
        {mainNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <item.icon className={`w-5 h-5 flex-shrink-0 ${!isActive && item.iconColor ? item.iconColor : ""}`} />
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          )
        })}

        {/* Tools section */}
        {!collapsed && (
          <p className="text-xs text-gray-500 uppercase tracking-wider px-3 pt-6 pb-2">
            Tools
          </p>
        )}
        {collapsed && <div className="h-6" />}

        {tools.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-gray-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className={`w-5 h-5 rounded flex items-center justify-center ${item.bgColor}`}>
                <item.icon className={`w-3.5 h-3.5 ${item.iconColor}`} />
              </div>
              {!collapsed && <span className="text-sm font-medium">{item.name}</span>}
            </Link>
          )
        })}

        {/* More */}
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-gray-300 hover:bg-white/5 hover:text-white w-full">
          <MoreHorizontal className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span className="text-sm font-medium">More</span>}
        </button>
      </nav>

      {/* Bottom section */}
      <div className="p-3 space-y-2">
        {/* Earn credits */}
        {!collapsed && (
          <div className="flex items-center gap-2 px-3 py-2 text-sm text-gray-300">
            <Gift className="w-4 h-4 text-yellow-400" />
            <span>Earn 3,000 Credits</span>
          </div>
        )}

        {/* Upgrade button */}
        <Button
          className={`w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-medium ${
            collapsed ? "px-2" : ""
          }`}
        >
          {collapsed ? <Zap className="w-4 h-4" /> : "Upgrade"}
        </Button>

        {/* User */}
        <div className={`flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 cursor-pointer ${collapsed ? "justify-center" : ""}`}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
            A
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm text-white truncate">awesomeuser</p>
              <p className="text-xs text-gray-500">Free</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}
