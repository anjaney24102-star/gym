"use client"

import { motion } from "framer-motion"
import { CreditCard, Calendar, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { memberData } from "@/lib/dashboard-data"

const paymentHistory = [
  { id: 1, date: "2024-01-15", amount: 7999, status: "completed", plan: "Elite" },
  { id: 2, date: "2023-01-15", amount: 7499, status: "completed", plan: "Elite" },
  { id: 3, date: "2022-01-15", amount: 6999, status: "completed", plan: "Pro" },
]

const planFeatures = [
  "24/7 Gym Access",
  "Personal Trainer Sessions (4/month)",
  "Group Classes",
  "Sauna & Steam Room",
  "Nutrition Consultation",
  "Body Composition Analysis",
  "Locker & Towel Service",
  "Priority Equipment Booking",
]

export default function MembershipPage() {
  const expiryDate = new Date(memberData.expiryDate)
  const today = new Date()
  const daysRemaining = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  const totalDays = 365
  const progressPercent = ((totalDays - daysRemaining) / totalDays) * 100

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Membership" 
        subtitle="Manage your gym membership"
      />

      <div className="p-6 space-y-6">
        {/* Current Plan */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="glass-card border-border border-l-4 border-l-primary">
            <CardContent className="pt-6">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-xl bg-primary/20 flex items-center justify-center">
                    <CreditCard className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-2xl font-bold text-foreground">{memberData.plan} Plan</h2>
                      <Badge className="bg-primary/20 text-primary">Active</Badge>
                    </div>
                    <p className="text-muted-foreground mt-1">Member ID: {memberData.memberId}</p>
                    <p className="text-sm text-muted-foreground">Joined: {new Date(memberData.joinDate).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-left lg:text-right">
                  <p className="text-3xl font-bold text-foreground">₹7,999<span className="text-sm font-normal text-muted-foreground">/month</span></p>
                  <Button className="mt-3">Renew Membership</Button>
                </div>
              </div>

              {/* Validity Progress */}
              <div className="mt-6 p-4 rounded-lg bg-muted/30">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Membership Validity</span>
                  </div>
                  <span className="text-sm font-medium text-foreground">{daysRemaining} days remaining</span>
                </div>
                <Progress value={progressPercent} className="h-2" />
                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                  <span>{new Date(memberData.joinDate).toLocaleDateString()}</span>
                  <span>{expiryDate.toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Plan Features */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card border-border h-full">
              <CardHeader>
                <CardTitle className="text-foreground">Plan Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3">
                  {planFeatures.map((feature, index) => (
                    <motion.div
                      key={feature}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.05 }}
                      className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-foreground">{feature}</span>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Trainer Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="glass-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Assigned Trainer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-4 p-4 rounded-lg bg-muted/30">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">V</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">{memberData.trainer}</h3>
                    <p className="text-sm text-muted-foreground">Personal Trainer</p>
                    <div className="flex items-center gap-1 mt-1 text-yellow-500">
                      <span>★</span>
                      <span className="text-sm">4.9</span>
                      <span className="text-xs text-muted-foreground">(128 reviews)</span>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Contact</Button>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-muted/30 text-center">
                    <p className="text-2xl font-bold text-foreground">4</p>
                    <p className="text-xs text-muted-foreground">Sessions/Month</p>
                  </div>
                  <div className="p-3 rounded-lg bg-muted/30 text-center">
                    <p className="text-2xl font-bold text-foreground">2</p>
                    <p className="text-xs text-muted-foreground">Used This Month</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card className="glass-card border-border mt-6">
              <CardHeader>
                <CardTitle className="text-foreground">Payment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {paymentHistory.map((payment) => (
                    <div 
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{payment.plan} Plan</p>
                          <p className="text-xs text-muted-foreground">{payment.date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-foreground">₹{payment.amount.toLocaleString()}</p>
                        <Badge variant="secondary" className="bg-green-500/20 text-green-400 text-xs">
                          {payment.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Upgrade Banner */}
        {memberData.plan !== "Elite" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="glass-card border-border bg-gradient-to-r from-primary/10 to-transparent">
              <CardContent className="py-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-8 h-8 text-primary" />
                    <div>
                      <h3 className="font-semibold text-foreground">Upgrade to Elite</h3>
                      <p className="text-sm text-muted-foreground">Get unlimited trainer sessions and premium perks</p>
                    </div>
                  </div>
                  <Button>Upgrade Now</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </div>
    </div>
  )
}
