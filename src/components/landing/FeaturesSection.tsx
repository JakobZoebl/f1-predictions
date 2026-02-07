import { Card, CardContent } from "@/components/ui/card"
import { Trophy, BarChart3, Target } from "lucide-react"

const features = [
  {
    icon: Trophy,
    title: "COMPETE",
    description: "Predict race results every weekend",
  },
  {
    icon: BarChart3,
    title: "TRACK STATS",
    description: "See detailed analytics & your prediction history",
  },
  {
    icon: Target,
    title: "WIN",
    description: "Climb the leaderboard all season",
  },
]

export function FeaturesSection() {
  return (
    <section className="bg-secondary/40 py-16">
      <div className="mx-auto max-w-5xl px-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group border-primary/20 bg-card transition-all duration-300 hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10"
            >
              <CardContent className="flex flex-col gap-3 p-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display text-lg font-bold tracking-wide text-foreground">
                    {feature.title}
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
