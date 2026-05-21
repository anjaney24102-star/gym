"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Send, Phone, Video } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { chatMessages } from "@/lib/dashboard-data"
import { cn } from "@/lib/utils"

export default function TrainerChat() {
  const [messages, setMessages] = useState(chatMessages)
  const [newMessage, setNewMessage] = useState("")

  const handleSend = () => {
    if (!newMessage.trim()) return
    
    const message = {
      id: messages.length + 1,
      sender: "member" as const,
      name: "You",
      message: newMessage,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }
    
    setMessages([...messages, message])
    setNewMessage("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Trainer Chat" 
        subtitle="Connect with your personal trainer"
      />

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Trainer Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <Card className="glass-card border-border">
              <CardContent className="pt-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="w-24 h-24 mb-4">
                    <AvatarFallback className="bg-primary/20 text-primary text-2xl">VS</AvatarFallback>
                  </Avatar>
                  <h3 className="text-lg font-semibold text-foreground">Vikram Singh</h3>
                  <p className="text-sm text-muted-foreground">Personal Trainer</p>
                  <Badge className="mt-2 bg-green-500/20 text-green-400">Online</Badge>
                  
                  <div className="flex gap-3 mt-6 w-full">
                    <Button variant="outline" className="flex-1">
                      <Phone className="w-4 h-4 mr-2" />
                      Call
                    </Button>
                    <Button variant="outline" className="flex-1">
                      <Video className="w-4 h-4 mr-2" />
                      Video
                    </Button>
                  </div>

                  <div className="mt-6 w-full space-y-3 text-left">
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">Specialization</p>
                      <p className="text-sm text-foreground">Strength Training</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">Experience</p>
                      <p className="text-sm text-foreground">8+ Years</p>
                    </div>
                    <div className="p-3 rounded-lg bg-muted/30">
                      <p className="text-xs text-muted-foreground">Certifications</p>
                      <p className="text-sm text-foreground">ACE, NASM, CrossFit L2</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Chat Area */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-3"
          >
            <Card className="glass-card border-border h-[calc(100vh-220px)] flex flex-col">
              <CardHeader className="border-b border-border">
                <CardTitle className="text-foreground flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                  Chat with Vikram
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col p-0">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, index) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className={cn(
                        "flex gap-3",
                        msg.sender === "member" ? "justify-end" : "justify-start"
                      )}
                    >
                      {msg.sender === "trainer" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-primary/20 text-primary text-xs">VS</AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={cn(
                          "max-w-[70%] p-3 rounded-2xl",
                          msg.sender === "member"
                            ? "bg-primary text-primary-foreground rounded-br-md"
                            : "bg-muted text-foreground rounded-bl-md"
                        )}
                      >
                        <p className="text-sm">{msg.message}</p>
                        <p className={cn(
                          "text-xs mt-1",
                          msg.sender === "member" ? "text-primary-foreground/70" : "text-muted-foreground"
                        )}>
                          {msg.time}
                        </p>
                      </div>
                      {msg.sender === "member" && (
                        <Avatar className="w-8 h-8">
                          <AvatarFallback className="bg-muted text-muted-foreground text-xs">RS</AvatarFallback>
                        </Avatar>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Input */}
                <div className="p-4 border-t border-border">
                  <div className="flex gap-3">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type your message..."
                      className="flex-1 bg-muted/50 border-border"
                    />
                    <Button onClick={handleSend} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
