import { Trophy, BarChart3, Target } from "lucide-react"
import type { LucideIcon } from "lucide-react"

const features: { icon: LucideIcon; title: string; description: string }[] = [
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
    <section className="px-4 py-16 md:py-20">
      <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
        {features.map((feature) => (
          <FeatureCard key={feature.title} {...feature} />
        ))}
      </div>
    </section>
  )
}

function FeatureCard({
  icon: Icon,
  title,
  description,
}: {
  icon: LucideIcon
  title: string
  description: string
}) {
  return (
    <div className="group relative overflow-hidden rounded-lg border border-f1-card-border bg-f1-card/60 px-6 py-6 backdrop-blur-sm transition-colors hover:border-f1-red/50">
      {/* Red accent corner */}
      <div className="pointer-events-none absolute left-0 top-0 h-10 w-[3px] rounded-br-full bg-f1-red" />
      <div className="pointer-events-none absolute left-0 top-0 h-[3px] w-10 rounded-br-full bg-f1-red" />

      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-f1-red" />
          <h3 className="text-sm font-bold tracking-wider text-foreground">
            {title}
          </h3>
        </div>
        <p className="text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </div>
    </div>
  )
}
