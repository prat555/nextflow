import { DashboardSidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#0a0a0a]">
      <DashboardSidebar />
      <main className="pl-60 min-h-screen">
        {children}
      </main>
    </div>
  )
}
