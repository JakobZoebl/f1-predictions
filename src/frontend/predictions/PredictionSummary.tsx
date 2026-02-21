"use client"

interface PredictionSummaryProps {
  driverCount: number
  constructorCount: number
  bonusCount: number
  totalBonusFields: number
  onAutoFill?: () => void
  onSubmit?: () => void
  // Optional customizations for Season Predictions
  labels?: {
    drivers?: string
    constructors?: string
    bonus?: string
  }
  maxPoints?: {
    drivers?: number
    constructors?: number
    bonus?: number
  }
  totalDrivers?: number
  totalConstructors?: number
}

export function PredictionSummary({
  driverCount,
  constructorCount,
  bonusCount,
  totalBonusFields,
  onAutoFill,
  onSubmit,
  labels = {
    drivers: "Top 10 Drivers",
    constructors: "Top 5 Constructors",
    bonus: "Bonus Predictions"
  },
  maxPoints = {
    drivers: 101,
    constructors: 80,
    bonus: 40
  },
  totalDrivers = 10,
  totalConstructors = 5,
}: PredictionSummaryProps) {
  // Calculate potential max points based on filled fields
  const driverMaxPoints = driverCount > 0 ? maxPoints.drivers ?? 101 : 0
  const constructorMaxPoints = constructorCount > 0 ? maxPoints.constructors ?? 80 : 0
  const bonusMaxPoints = bonusCount > 0 ? maxPoints.bonus ?? 40 : 0
  const totalMaxPoints = driverMaxPoints + constructorMaxPoints + bonusMaxPoints

  // Calculate completion
  const totalFields = totalDrivers + totalConstructors + totalBonusFields
  const filledFields = driverCount + constructorCount + bonusCount
  const completionPct = totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0

  return (
    <>
      {/* Completion Bar */}
      <div className="completion-bar-container">
        <div className="completion-bar-header">
          <span className="completion-bar-label">Prediction Completion</span>
          <span className="completion-bar-pct">{completionPct}%</span>
        </div>
        <div className="completion-bar-track">
          <div
            className="completion-bar-fill"
            style={{ width: `${completionPct}%` }}
          />
        </div>
      </div>

      {/* Summary Card */}
      <div className="prediction-summary">
        <h3 className="summary-title">Potential Points</h3>

        <div className="summary-breakdown">
          <div className="summary-row">
            <span className="label">
              {labels.drivers} ({driverCount}/{totalDrivers} filled)
            </span>
            <span className="value">max {driverMaxPoints} pts</span>
          </div>
          {totalConstructors > 0 && (
            <div className="summary-row">
              <span className="label">
                {labels.constructors} ({constructorCount}/{totalConstructors} filled)
              </span>
              <span className="value">max {constructorMaxPoints} pts</span>
            </div>
          )}
          <div className="summary-row">
            <span className="label">
              {labels.bonus} ({bonusCount}/{totalBonusFields} filled)
            </span>
            <span className="value">max {bonusMaxPoints} pts</span>
          </div>
        </div>

        <div className="summary-divider" />

        <div className="summary-total">
          <span className="label">Total Maximum</span>
          <span className="value">{totalMaxPoints} pts</span>
        </div>

        <div className="summary-actions">
          {onAutoFill && (
            <button 
              type="button" 
              className="btn-save-draft"
              onClick={onAutoFill}
            >
              Auto-Fill
            </button>
          )}
          <div 
            className="flex-1 flex"
            title={completionPct < 100 ? "submission not possible unless 100%" : undefined}
            style={{ cursor: completionPct < 100 ? 'not-allowed' : 'default' }}
          >
            <button
              type="button"
              className="btn-submit w-full flex-1"
              disabled={completionPct < 100}
              onClick={onSubmit}
              style={completionPct < 100 ? { pointerEvents: 'none' } : {}}
            >
              Submit Prediction
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
