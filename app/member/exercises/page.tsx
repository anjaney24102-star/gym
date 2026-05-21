"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Play, Clock, Flame, Filter, Search } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { exerciseLibrary } from "@/lib/dashboard-data"

const categories = ["All", "Chest", "Back", "Legs", "Shoulders", "Arms"]
const difficulties = ["All", "Beginner", "Intermediate", "Advanced"]

export default function ExerciseLibrary() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedDifficulty, setSelectedDifficulty] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedExercise, setSelectedExercise] = useState<typeof exerciseLibrary[0] | null>(null)

  const filteredExercises = exerciseLibrary.filter((exercise) => {
    const matchesCategory = selectedCategory === "All" || exercise.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === "All" || exercise.difficulty === selectedDifficulty
    const matchesSearch = exercise.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesDifficulty && matchesSearch
  })

  return (
    <div className="min-h-screen">
      <DashboardHeader 
        title="Exercise Library" 
        subtitle="Learn proper form and technique"
      />

      <div className="p-6 space-y-6">
        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-xl p-4"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search exercises..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border"
              />
            </div>
            <div className="flex gap-3">
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-40 bg-muted/50 border-border">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger className="w-40 bg-muted/50 border-border">
                  <SelectValue placeholder="Difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((diff) => (
                    <SelectItem key={diff} value={diff}>{diff}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </motion.div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExercises.map((exercise, index) => (
            <motion.div
              key={exercise.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Dialog>
                <DialogTrigger asChild>
                  <Card 
                    className="glass-card border-border cursor-pointer hover:border-primary/50 transition-all duration-300 group overflow-hidden"
                    onClick={() => setSelectedExercise(exercise)}
                  >
                    <div className="relative aspect-video bg-muted/50 overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-t from-background/80 to-transparent">
                        <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Play className="w-8 h-8 text-primary-foreground ml-1" />
                        </div>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                        <Badge className="bg-primary/80 text-primary-foreground">{exercise.category}</Badge>
                        <Badge variant="secondary" className="bg-background/80">{exercise.difficulty}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
                        {exercise.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
                        {exercise.description}
                      </p>
                      <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>3-5 min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4" />
                          <span>50-100 cal</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </DialogTrigger>
                <DialogContent className="max-w-3xl bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="text-foreground">{exercise.name}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="aspect-video rounded-lg overflow-hidden bg-muted">
                      <iframe
                        src={exercise.videoUrl}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                    <div className="flex gap-2">
                      <Badge className="bg-primary/20 text-primary">{exercise.category}</Badge>
                      <Badge variant="secondary">{exercise.difficulty}</Badge>
                    </div>
                    <p className="text-muted-foreground">{exercise.description}</p>
                    <div className="glass-card rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Tips for proper form:</h4>
                      <ul className="space-y-2 text-sm text-muted-foreground">
                        <li>• Keep your core engaged throughout the movement</li>
                        <li>• Control the weight on both the concentric and eccentric phases</li>
                        <li>• Breathe out during exertion, breathe in during the return</li>
                        <li>• Start with lighter weight to master the form</li>
                      </ul>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </motion.div>
          ))}
        </div>

        {filteredExercises.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No exercises found matching your criteria.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => {
                setSelectedCategory("All")
                setSelectedDifficulty("All")
                setSearchQuery("")
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
