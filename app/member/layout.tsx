import { MemberSidebar } from "@/components/dashboard/member-sidebar"

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background">
      <MemberSidebar />
      <main className="lg:pl-[280px] min-h-screen transition-all duration-300">
        {children}
      </main>
    </div>
  )
}
