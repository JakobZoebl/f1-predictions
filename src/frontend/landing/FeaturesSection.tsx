import { Card, CardContent } from "@/frontend/components/card"
import { Trophy, BarChart3, Target } from "lucide-react"
import "@/frontend/styles/FeaturesSection.css"

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
    <section className="features-section">
      <div className="features-container">
        <div className="features-grid">
          {features.map((feature) => (
            <Card
              key={feature.title}
              className="group feature-card"
            >
              <CardContent className="feature-card-content">
                <div className="feature-header">
                  <div className="feature-icon-wrapper">
                    <feature.icon className="feature-icon" />
                  </div>
                  <h3 className="feature-title">
                    {feature.title}
                  </h3>
                </div>
                <p className="feature-description">
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
