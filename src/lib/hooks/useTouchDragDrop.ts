"use client"

import { useRef, useCallback, useState } from "react"

interface UseTouchDragDropOptions {
  /** Called when a drag starts – receives the item key */
  onDragStart?: (key: string) => void
  /** Called when the touch moves over a different slot */
  onDragOver?: (slotIndex: number | null) => void
  /** Called when the user lifts their finger over a slot */
  onDrop?: (slotIndex: number, itemKey: string) => void
  /** Called when the drag ends (finger lifts anywhere) */
  onDragEnd?: () => void
}

/**
 * Low-level touch-to-drag-drop bridge.
 *
 * Returns `getTouchHandlers(itemKey)` which you spread onto every draggable
 * element, and `getSlotProps(slotIndex)` which you spread onto every drop target.
 *
 * Drop targets **must** have `data-slot-index` set to their numeric index.
 */
export function useTouchDragDrop(options: UseTouchDragDropOptions) {
  const draggedKeyRef = useRef<string | null>(null)
  const [touchDragging, setTouchDragging] = useState(false)
  const currentSlotRef = useRef<number | null>(null)

  // ── helpers ────────────────────────────────────────────
  const findSlotUnderPoint = useCallback((x: number, y: number): number | null => {
    const el = document.elementFromPoint(x, y)
    if (!el) return null

    // Walk up until we find a [data-slot-index]
    const slot = (el as HTMLElement).closest?.("[data-slot-index]") as HTMLElement | null
    if (slot) {
      const idx = parseInt(slot.dataset.slotIndex!, 10)
      return isNaN(idx) ? null : idx
    }
    return null
  }, [])

  // ── touch handlers for draggable items ─────────────────
  const handleTouchStart = useCallback(
    (key: string, e: React.TouchEvent) => {
      // Only track single-finger drags
      if (e.touches.length !== 1) return

      draggedKeyRef.current = key
      setTouchDragging(true)
      options.onDragStart?.(key)
    },
    [options],
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!draggedKeyRef.current) return

      // Prevent scroll while dragging
      e.preventDefault()

      const touch = e.touches[0]
      const slotIdx = findSlotUnderPoint(touch.clientX, touch.clientY)

      if (slotIdx !== currentSlotRef.current) {
        currentSlotRef.current = slotIdx
        options.onDragOver?.(slotIdx)
      }
    },
    [findSlotUnderPoint, options],
  )

  const handleTouchEnd = useCallback(
    () => {
      const key = draggedKeyRef.current
      const slot = currentSlotRef.current

      if (key && slot !== null) {
        options.onDrop?.(slot, key)
      }

      draggedKeyRef.current = null
      currentSlotRef.current = null
      setTouchDragging(false)
      options.onDragEnd?.()
    },
    [options],
  )

  /**
   * Spread onto every draggable element:
   * ```tsx
   * <div {...getTouchHandlers(itemKey)}>...</div>
   * ```
   */
  const getTouchHandlers = useCallback(
    (key: string) => ({
      onTouchStart: (e: React.TouchEvent) => handleTouchStart(key, e),
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      style: { touchAction: "none" as const },
    }),
    [handleTouchStart, handleTouchMove, handleTouchEnd],
  )

  /**
   * Spread onto every drop-target slot:
   * ```tsx
   * <div {...getSlotProps(index)}>...</div>
   * ```
   */
  const getSlotProps = useCallback(
    (index: number) => ({
      "data-slot-index": index,
    }),
    [],
  )

  return { getTouchHandlers, getSlotProps, touchDragging }
}
