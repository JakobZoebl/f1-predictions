"use client"

import { useState, useCallback } from "react"
import { TEAMS } from "@/lib/f1-presets"

const POINTS = [25, 18, 15, 12, 10]

interface ConstructorDragDropProps {
  selected: (string | null)[]
  onChange: (selected: (string | null)[]) => void
}

export function ConstructorDragDrop({ selected, onChange }: ConstructorDragDropProps) {
  const [draggedTeam, setDraggedTeam] = useState<string | null>(null)
  const [dragOverSlot, setDragOverSlot] = useState<number | null>(null)

  const allTeamKeys = Object.keys(TEAMS)
  const poolTeams = allTeamKeys.filter((key) => !selected.includes(key))

  const handleDragStart = useCallback((teamKey: string) => {
    setDraggedTeam(teamKey)
  }, [])

  const handleDragEnd = useCallback(() => {
    setDraggedTeam(null)
    setDragOverSlot(null)
  }, [])

  const handleSlotDrop = useCallback(
    (targetIndex: number) => {
      if (!draggedTeam) return

      const newSelected = [...selected]
      const oldIndex = newSelected.indexOf(draggedTeam)
      const targetTeam = newSelected[targetIndex]

      // Place dragged team in target slot
      newSelected[targetIndex] = draggedTeam

      // If dragged from another slot, swap
      if (oldIndex !== -1) {
        newSelected[oldIndex] = targetTeam
      }

      onChange(newSelected)
      setDraggedTeam(null)
      setDragOverSlot(null)
    },
    [draggedTeam, selected, onChange]
  )

  const handleRemoveFromSlot = useCallback(
    (teamKey: string) => {
      const newSelected = [...selected]
      const index = newSelected.indexOf(teamKey)
      if (index !== -1) {
        newSelected[index] = null
        onChange(newSelected)
      }
    },
    [selected, onChange]
  )

  return (
    <div>
      {/* Top 5 Slots */}
      <div className="dnd-slots-container">
        {Array.from({ length: 5 }, (_, i) => {
          const teamKey = selected[i]
          const team = teamKey ? TEAMS[teamKey] : null

          return (
            <div
              key={i}
              className={`dnd-slot ${dragOverSlot === i ? "drag-over" : ""} ${team ? "cursor-grab" : ""}`}
              draggable={!!team}
              onDragStart={() => {
                if (teamKey) handleDragStart(teamKey)
              }}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => {
                e.preventDefault()
                setDragOverSlot(i)
              }}
              onDragLeave={() => setDragOverSlot(null)}
              onDrop={(e) => {
                e.preventDefault()
                handleSlotDrop(i)
              }}
            >
              <span className="dnd-slot-position">P{i + 1}</span>

              {team ? (
                <div className="dnd-slot-driver">
                  <div
                    className="team-accent"
                    style={{ backgroundColor: team.colors.primary }}
                  />
                  <div className="driver-info">
                    <span className="driver-name">{team.name}</span>
                  </div>
                  <button
                    className="remove-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFromSlot(teamKey)
                    }}
                    onMouseDown={(e) => e.stopPropagation()}
                    aria-label={`Remove ${team.name}`}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <span className="dnd-slot-empty">
                  Drag a constructor here
                </span>
              )}

              <span className="dnd-slot-points">{POINTS[i]} pts</span>
            </div>
          )
        })}
      </div>

      {/* Remaining Constructors Pool */}
      {poolTeams.length > 0 && (
        <>
          <p className="dnd-pool-label">
            Remaining Constructors ({poolTeams.length}) — 10 pts each if in top
            5
          </p>
          <div className="dnd-pool">
            {poolTeams.map((key) => {
              const team = TEAMS[key]
              return (
                <div
                  key={key}
                  className={`dnd-pool-item ${draggedTeam === key ? "dragging" : ""}`}
                  draggable
                  onDragStart={() => handleDragStart(key)}
                  onDragEnd={handleDragEnd}
                >
                  <div
                    className="team-accent"
                    style={{ backgroundColor: team.colors.primary }}
                  />
                  <span className="driver-name">{team.name}</span>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}
