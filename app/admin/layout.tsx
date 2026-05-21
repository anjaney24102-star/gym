import { AdminSidebar } from "@/components/dashboard/admin-sidebar"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <main className="lg:pl-[280px] min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
