import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import AttendanceTracker from "@/components/dashboard/attendance-tracker"

export default function MemberAttendancePage() {
  return (
    <div className="min-h-screen">
      <DashboardHeader title="Attendance" subtitle="Keep your streak going" />
      <div className="p-6">
        <AttendanceTracker />
      </div>
    </div>
  )
}
