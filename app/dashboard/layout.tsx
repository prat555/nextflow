"use client"

import { usePathname } from "next/navigation"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { SidebarProvider, useSidebar } from "@/lib/sidebar-context"

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { collapsed } = useSidebar()

  // The workflow canvas has its own custom left sidebar, so we hide the global dashboard sidebar.
  const isWorkflowCanvasRoute = pathname.startsWith("/dashboard/workflow/") && !pathname.startsWith("/dashboard/workflow/new")

  const marginLeft = collapsed ? "md:ml-16" : "md:ml-60"

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {!isWorkflowCanvasRoute && <DashboardSidebar />}
      <main
        className={[
          isWorkflowCanvasRoute ? "" : marginLeft,
          "min-h-screen bg-[#0d0d0d] transition-all duration-300",
        ].join(" ")}
      >
        {children}
      </main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </SidebarProvider>
  )
}
