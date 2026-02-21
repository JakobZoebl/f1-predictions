import { F1Header } from "@/frontend/components/f1-header"
import { F1Footer } from "@/frontend/components/f1-footer"
import { useAuth } from "@/frontend/auth/AuthContext"
import { useUserProfile } from "@/lib/hooks/UserProfileContext"

export default function PointSchemaPage() {
  const { user } = useAuth()
  const { profile } = useUserProfile()

  const isAuthenticated = !!user
  const username = profile?.username || user?.user_metadata?.username || "User"

  return (
    <div className="flex flex-col min-h-screen">
      <F1Header 
        variant="back" 
        backHref="/" 
        isAuthenticated={isAuthenticated}
        username={username}
      />
      
      <main className="flex-1 container mx-auto px-4 py-12 max-w-4xl">
        <div className="bg-black/20 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-white/90 shadow-2xl">
          <h1 className="text-4xl font-bold mb-8 text-white border-b border-f1-neon pb-4">
            Scoring System
          </h1>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-4 text-f1-neon">Race Predictions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Top 10 Drivers</h3>
                <p className="mb-2 text-white/70">Predict the order of the top 10 finishers in the Grand Prix.</p>
                <ul className="list-disc list-inside space-y-1 text-white/80">
                  <li>Exact position match: F1 points (25, 18, 15, 12, 10, 8, 6, 4, 2, 1)</li>
                  <li>In top 10 but wrong position: 2 points</li>
                  <li>Maximum possible: 101 points</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Top 5 Constructors</h3>
                <p className="mb-2 text-white/70">Predict the order of the top 5 teams in the Grand Prix.</p>
                <ul className="list-disc list-inside space-y-1 text-white/80">
                  <li>Exact position match: Constructor points (25, 18, 15, 12, 10)</li>
                  <li>In top 5 but wrong position: 10 points</li>
                  <li>Maximum possible: 80 points</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Bonus Predictions</h3>
                <ul className="list-disc list-inside space-y-2 text-white/80">
                  <li><span className="font-bold">Pole Position:</span> 10 points</li>
                  <li><span className="font-bold">Fastest Lap:</span> 10 points</li>
                  <li><span className="font-bold">First Retirement:</span> 10 points</li>
                  <li><span className="font-bold">Safety Car / VSC Deployed:</span> 5 points</li>
                  <li><span className="font-bold">Red Flag:</span> 5 points for "Yes", 1 point for "No"</li>
                  <li>Maximum possible: 40 points</li>
                </ul>
              </div>
              
              <p className="pt-4 font-bold text-xl text-white">Total Race Maximum: 221 points</p>
            </div>
          </section>

          <section className="mb-12 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-semibold mb-4 text-f1-neon">Sprint Predictions</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Top 8 Sprint Finish</h3>
                <ul className="list-disc list-inside space-y-1 text-white/80">
                  <li>Exact position: Sprint points (8, 7, 6, 5, 4, 3, 2, 1)</li>
                  <li>In top 8 but wrong position: 1 point</li>
                  <li>Maximum possible: 36 points</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Top 5 Sprint Constructors</h3>
                <ul className="list-disc list-inside space-y-1 text-white/80">
                  <li>Exact position match: Sprint Constructor points (8, 7, 6, 5, 4)</li>
                  <li>In top 5 but wrong position: 4 points</li>
                  <li>Maximum possible: 30 points</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Bonus Predictions</h3>
                <p className="text-white/70 italic">Same as Grand Prix bonus points (Maximum: 40 points)</p>
              </div>

              <p className="pt-4 font-bold text-xl text-white">Total Sprint Maximum: 106 points</p>
            </div>
          </section>

          <section className="mb-8 border-t border-white/10 pt-8">
            <h2 className="text-2xl font-semibold mb-4 text-f1-neon">Season Predictions</h2>
            <p className="mb-6 text-white/70 italic">Season predictions unlock before Round 1 and apply a 10x multiplier to race-style scoring.</p>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Drivers Championship (All 22)</h3>
                <ul className="list-disc list-inside space-y-1 text-white/80">
                  <li>Exact position in Top 10: 250, 180, 150, 120, 100, 80, 60, 40, 20, 10 points</li>
                  <li>In Top 10 but wrong position: 20 points</li>
                  <li>Exact position outside Top 10 (P11-P22): 10 points each</li>
                  <li>Maximum possible: 1130 points</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Constructors Championship (All 11)</h3>
                <ul className="list-disc list-inside space-y-1 text-white/80">
                  <li>Exact position in Top 5: 250, 180, 150, 120, 100 points</li>
                  <li>In Top 5 but wrong position: 20 points</li>
                  <li>Exact position outside Top 5 (P6-P11): 10 points each</li>
                  <li>Maximum possible: 860 points</li>
                </ul>
              </div>

              <div>
                <h3 className="text-xl font-medium mb-2">Season Bonus</h3>
                <ul className="list-disc list-inside space-y-1 text-white/80">
                  <li>Most Pole Positions: 100 points</li>
                  <li>Most Fastest Laps: 100 points</li>
                  <li>Most First Retirements: 100 points</li>
                  <li>Maximum possible: 300 points</li>
                </ul>
              </div>

              <p className="pt-4 font-bold text-xl text-white">Total Season Maximum: 2290 points</p>
            </div>
          </section>
        </div>
      </main>

      <F1Footer />
    </div>
  )
}
