"use client"

interface PredictionSummaryProps {
  driverCount: number
  constructorCount: number
  bonusCount: number
  totalBonusFields: number
}

export function PredictionSummary({
  driverCount,
  constructorCount,
  bonusCount,
  totalBonusFields,
}: PredictionSummaryProps) {
  // Calculate potential max points based on filled fields
  const driverMaxPoints = driverCount > 0 ? 152 : 0
  const constructorMaxPoints = constructorCount > 0 ? 70 : 0
  const bonusMaxPoints = bonusCount > 0 ? 41 : 0
  const totalMaxPoints = driverMaxPoints + constructorMaxPoints + bonusMaxPoints

  // Calculate completion
  const totalFields = 10 + 5 + totalBonusFields // 10 drivers + 5 constructors + bonus fields
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
              Top 10 Drivers ({driverCount}/10 filled)
            </span>
            <span className="value">max {driverMaxPoints} pts</span>
          </div>
          <div className="summary-row">
            <span className="label">
              Top 5 Constructors ({constructorCount}/5 filled)
            </span>
            <span className="value">max {constructorMaxPoints} pts</span>
          </div>
          <div className="summary-row">
            <span className="label">
              Bonus Predictions ({bonusCount}/{totalBonusFields} filled)
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
          <button type="button" className="btn-save-draft">
            Save Draft
          </button>
          <button
            type="button"
            className="btn-submit"
            disabled={completionPct < 100}
          >
            Submit Prediction
          </button>
        </div>
      </div>
    </>
  )
}
