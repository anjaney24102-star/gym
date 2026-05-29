import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, Dumbbell } from "lucide-react"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { muscleGroupLibrary } from "@/lib/dashboard-data"

interface MusclePageProps {
  params: Promise<{ muscle: string }>
}

export default async function MuscleDetailPage({ params }: MusclePageProps) {
  const { muscle } = await params
  const group = muscleGroupLibrary.find((item) => item.slug === muscle)

  if (!group) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <DashboardHeader title={`${group.name} Training`} subtitle="Exercise guide with form cues and workout focus" />

      <div className="p-6 space-y-6">
        <Link href="/member/exercises">
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to all body parts
          </Button>
        </Link>

        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl">
          <div className="grid gap-0 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="p-6 md:p-8">
              <Badge className="bg-primary/15 text-primary">Body Part Focus</Badge>
              <h2 className="mt-3 text-3xl font-semibold text-foreground md:text-4xl">{group.name}</h2>
              <p className="mt-4 max-w-xl text-muted-foreground">{group.summary}</p>
              <div className="mt-6 flex flex-wrap gap-3 text-sm text-muted-foreground">
                <span className="rounded-full border border-border bg-muted/50 px-3 py-1">Strength</span>
                <span className="rounded-full border border-border bg-muted/50 px-3 py-1">Muscle growth</span>
                <span className="rounded-full border border-border bg-muted/50 px-3 py-1">Form coaching</span>
              </div>
            </div>
            <img src={group.image} alt={group.name} className="h-full min-h-[260px] w-full object-cover" />
          </div>
        </section>

        <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {group.exercises.map((exercise, index) => (
            <article key={exercise.name}>
              <Card className="h-full border-border bg-card/80 shadow-lg transition hover:-translate-y-1 hover:border-primary/60">
                <CardContent className="p-5">
                  <div className="flex items-center gap-2 text-primary">
                    <Dumbbell className="h-4 w-4" />
                    <span className="text-xs uppercase tracking-[0.2em]">Exercise {index + 1}</span>
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-foreground">{exercise.name}</h3>
                  <p className="mt-3 text-sm text-muted-foreground">{exercise.howTo}</p>
                </CardContent>
              </Card>
            </article>
          ))}
        </section>
      </div>
    </div>
  )
}
