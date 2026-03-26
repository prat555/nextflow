"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
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
  Plus,
  Coins,
  Settings,
  BarChart3,
  LogOut,
  ChevronDown,
} from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { SidebarToggleButton } from "@/components/sidebar-toggle-button"
import { useClerk, useUser } from "@clerk/nextjs"
import { useSidebar } from "@/lib/sidebar-context"
import { useIsMobile } from "@/hooks/use-mobile"

const mainNav = [
  { name: "Home", href: "/dashboard", icon: Home, iconColor: "text-gray-400" },
  { name: "Train Lora", href: "/dashboard/train-lora", icon: Sparkles, iconColor: "text-orange-400" },
  { name: "Node Editor", href: "/dashboard/workflow", icon: GitBranch, iconColor: "text-blue-400" },
  { name: "Assets", href: "/dashboard/assets", icon: Folder, iconColor: "text-blue-400" },
]

const tools = [
  { name: "Image", href: "/dashboard/image", icon: Image, iconColor: "text-blue-400" },
  { name: "Video", href: "/dashboard/video", icon: Video, iconColor: "text-orange-400" },
  { name: "Enhancer", href: "/dashboard/enhancer", icon: Wand2, iconColor: "text-gray-400" },
  { name: "Nano Banana", href: "/dashboard/nano-banana", icon: Zap, iconColor: "text-yellow-400" },
  { name: "Realtime", href: "/dashboard/realtime", icon: Zap, iconColor: "text-blue-400" },
  { name: "Edit", href: "/dashboard/edit", icon: Type, iconColor: "text-purple-400" },
  { name: "Video Lipsync", href: "/dashboard/video-lipsync", icon: Mic, iconColor: "text-gray-500" },
  { name: "Motion Transfer", href: "/dashboard/motion-transfer", icon: PersonStanding, iconColor: "text-yellow-400" },
  { name: "3D Objects", href: "/dashboard/3d-objects", icon: Circle, iconColor: "text-gray-400" },
  { name: "Video Restyle", href: "/dashboard/video-restyle", icon: Film, iconColor: "text-green-400" },
]

export function DashboardSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { signOut } = useClerk()
  const { user } = useUser()
  const { collapsed, setCollapsed } = useSidebar()
  const isMobile = useIsMobile()
  const [showAllTools, setShowAllTools] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const profileMenuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isMobile) {
      setMobileOpen(false)
    }
  }, [isMobile])

  useEffect(() => {
    if (!profileMenuOpen) return

    const onPointerDown = (event: MouseEvent) => {
      if (!profileMenuRef.current?.contains(event.target as Node)) {
        setProfileMenuOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProfileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", onPointerDown)
    document.addEventListener("keydown", onKeyDown)

    return () => {
      document.removeEventListener("mousedown", onPointerDown)
      document.removeEventListener("keydown", onKeyDown)
    }
  }, [profileMenuOpen])

  const visibleTools = showAllTools ? tools : tools.slice(0, 6)
  const displayName =
    user?.fullName?.trim() ||
    user?.firstName?.trim() ||
    user?.username?.trim() ||
    user?.primaryEmailAddress?.emailAddress?.trim() ||
    "User"
  const userInitial = displayName.charAt(0).toUpperCase()

  return (
    <>
      {isMobile && !mobileOpen ? (
        <button
          type="button"
          className="fixed left-3 top-3 z-50 rounded-lg border border-white/10 bg-[#0a0a0a] p-2 text-[#888] shadow-lg"
          onClick={() => setMobileOpen(true)}
          aria-label="Open sidebar"
        >
          <Plus className="h-4 w-4" />
        </button>
      ) : null}

      {isMobile && mobileOpen ? (
        <button
          type="button"
          className="fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileOpen(false)}
          aria-label="Close sidebar"
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 h-screen bg-[#0a0a0a] flex flex-col transition-all duration-300 z-50 ${
          isMobile
            ? `w-72 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`
            : collapsed
              ? "w-16"
              : "w-60"
        }`}
      >
      {/* Collapse button */}
      <div className="p-3">
        <SidebarToggleButton onClick={() => (isMobile ? setMobileOpen(false) : setCollapsed(!collapsed))} />
      </div>

      {/* Main navigation */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto dark-sidebar-scrollbar">
        {mainNav.map((item) => {
          let isActive = false;
          if (item.href === "/dashboard") {
            isActive = pathname === "/dashboard";
          } else {
            isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          }
          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={() => {
                if (isMobile) setMobileOpen(false)
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full ${
                isActive
                  ? "bg-[#1a1a1a] text-white"
                  : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
              } ${!isMobile && collapsed ? "justify-center" : ""}`}
            >
              <item.icon className={`shrink-0 ${item.iconColor} ${!isMobile && collapsed ? "w-5 h-5" : "w-4 h-4"}`} />
              {(isMobile || !collapsed) && <span className="text-sm">{item.name}</span>}
            </Link>
          )
        })}

        {/* Tools section */}
        {(isMobile || !collapsed) && (
          <p className="text-[11px] text-[#555] tracking-wider px-3 pt-6 pb-2">
            Tools
          </p>
        )}
        {!isMobile && collapsed && <div className="h-6" />}

        <div className={`space-y-0.5 transition-all duration-300 ${showAllTools ? "" : ""}`}>
          {visibleTools.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => {
                  if (isMobile) setMobileOpen(false)
                }}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors w-full ${
                  isActive
                    ? "bg-[#1a1a1a] text-white"
                    : "text-gray-400 hover:bg-[#1a1a1a] hover:text-white"
                } ${!isMobile && collapsed ? "justify-center" : ""}`}
              >
                <item.icon className={`shrink-0 ${item.iconColor} ${!isMobile && collapsed ? "w-5 h-5" : "w-4 h-4"}`} />
                {(isMobile || !collapsed) && <span className="text-sm">{item.name}</span>}
              </Link>
            )
          })}
        </div>

        {/* More/Less toggle */}
        {(isMobile || !collapsed) && (
          <button 
            onClick={() => setShowAllTools(!showAllTools)}
            className="flex items-center gap-2 px-3 py-2 text-[#555] hover:text-gray-300 transition-colors w-full"
          >
            <span className="text-sm tracking-wider">...</span>
            <span className="text-sm">{showAllTools ? "Less" : "More"}</span>
          </button>
        )}
      </nav>

      {/* Bottom section - Sessions */}
      <div className="relative px-3 pb-4 mt-auto" ref={profileMenuRef}>
        {(isMobile || !collapsed) && (
          <p className="text-[11px] text-[#555] tracking-wider px-3 pt-4 pb-2">
            Sessions
          </p>
        )}

        {profileMenuOpen && (
          <div className="absolute bottom-16 right-2 min-w-[210px] z-50 overflow-hidden rounded-xl border border-white/10 bg-[#181818] shadow-2xl flex flex-col items-stretch py-1">
            <button className="flex w-full items-center gap-2 rounded-none px-4 py-2 text-gray-200 hover:bg-[#232323]">
              <Sparkles className="h-4 w-4 text-gray-400" />
              Upgrade plan
            </button>
            <button className="flex w-full items-center gap-2 rounded-none px-4 py-2 text-gray-200 hover:bg-[#232323]">
              <Coins className="h-4 w-4 text-gray-400" />
              Buy credits
            </button>
            <button className="flex w-full items-center gap-2 rounded-none px-4 py-2 text-gray-200 hover:bg-[#232323]">
              <Settings className="h-4 w-4 text-gray-400" />
              Settings
            </button>
            <button className="flex w-full items-center gap-2 rounded-none px-4 py-2 text-gray-200 hover:bg-[#232323]">
              <BarChart3 className="h-4 w-4 text-gray-400" />
              Usage Statistics
            </button>
            <div className="border-t border-white/10 mx-2 my-1" />
            <button
              onClick={async () => {
                setProfileMenuOpen(false)
                await signOut()
                router.push("/")
              }}
              className="flex w-full items-center gap-2 rounded-none px-4 py-2 text-gray-100 hover:bg-[#232323]"
            >
              <LogOut className="h-4 w-4 text-gray-400" />
              Log out
            </button>
          </div>
        )}

        {/* User profile */}
        <button
          onClick={() => setProfileMenuOpen((prev) => !prev)}
          className={`flex w-full items-center gap-3 px-3 py-2 rounded-lg transition-colors hover:bg-[#171717] ${!isMobile && collapsed ? "justify-center" : ""}`}
        >
          <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {userInitial}
          </div>
          {(isMobile || !collapsed) && (
            <>
              <div className="flex-1 min-w-0 text-left">
                <p className="text-sm text-white truncate">{displayName}</p>
                <p className="text-xs text-[#555]">Free</p>
              </div>
              <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${profileMenuOpen ? "rotate-180" : ""}`} />
            </>
          )}
        </button>
      </div>
      </aside>
    </>
  )
}
