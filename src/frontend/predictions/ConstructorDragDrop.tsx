"use client"

import { useState, useCallback } from "react"
import { TEAMS } from "@/lib/f1-presets"
import { useTouchDragDrop } from "@/lib/hooks/useTouchDragDrop"

const POINTS = [25, 18, 15, 12, 10]

interface ConstructorDragDropProps {
  selected: (string | null)[]
  onChange: (selected: (string | null)[]) => void
  slotCount?: number
  points?: number[]
  poolLabel?: string
}

export function ConstructorDragDrop({ 
  selected, 
  onChange,
  slotCount = 5,
  points = POINTS,
  poolLabel = "Remaining Constructors — 10 pts each if in top 5" 
}: ConstructorDragDropProps) {
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
    (targetIndex: number, teamKey?: string) => {
      const team = teamKey || draggedTeam
      if (!team) return

      const newSelected = [...selected]
      const oldIndex = newSelected.indexOf(team)
      const targetTeam = newSelected[targetIndex]

      // Place dragged team in target slot
      newSelected[targetIndex] = team

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

  const handleClear = useCallback(() => {
    onChange(Array(slotCount).fill(null))
  }, [onChange, slotCount])

  // ── Touch drag-and-drop ─────────────────────────────────
  const { getTouchHandlers, getSlotProps } = useTouchDragDrop({
    onDragStart: (key) => setDraggedTeam(key),
    onDragOver: (slotIdx) => setDragOverSlot(slotIdx),
    onDrop: (slotIdx, key) => handleSlotDrop(slotIdx, key),
    onDragEnd: () => {
      setDraggedTeam(null)
      setDragOverSlot(null)
    },
  })

  return (
    <div className="relative">
      <div className="flex justify-end mb-3">
        <button
          onClick={handleClear}
          type="button"
          className="text-xs font-display font-bold uppercase tracking-wider text-white/60 hover:text-white transition-colors"
        >
          Clear
        </button>
      </div>
      {/* Slots */}
      <div className="dnd-slots-container">
        {Array.from({ length: slotCount }, (_, i) => {
          const teamKey = selected[i]
          const team = teamKey ? TEAMS[teamKey] : null

          // Merge touch handlers for filled slots (they are also draggable)
          const touchHandlers = teamKey ? getTouchHandlers(teamKey) : {}

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
              {...getSlotProps(i)}
              {...touchHandlers}
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
                      if (teamKey) {
                        handleRemoveFromSlot(teamKey)
                      }
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

              <span className="dnd-slot-points">{points[i] ?? 0} pts</span>
            </div>
          )
        })}
      </div>

      {/* Remaining Constructors Pool */}
      {poolTeams.length > 0 && (
        <>
          <p className="dnd-pool-label">
            {poolLabel.replace("{count}", poolTeams.length.toString())}
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
                  {...getTouchHandlers(key)}
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
