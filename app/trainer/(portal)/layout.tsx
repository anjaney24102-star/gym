import { TrainerSidebar } from "@/components/dashboard/trainer-sidebar"

export default function TrainerPortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <TrainerSidebar />
      <main className="min-h-screen transition-all duration-300 lg:pl-[280px]">
        {children}
      </main>
    </div>
  )
}
