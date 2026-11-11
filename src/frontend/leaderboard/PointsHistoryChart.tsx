import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/card"
import { SPRINTS } from "@/lib/f1-presets"
import * as d3 from "d3"

export interface PointsHistoryData {
  round: number
  sessionType?: "race" | "sprint"
  tickLabel?: string
  raceName: string
  points: number
  cumulativePoints: number
}

export interface UserPointsHistory {
  userId: string
  username: string
  color: string
  history: PointsHistoryData[]
}

interface PointsHistoryChartProps {
  data: UserPointsHistory[]
}

export function PointsHistoryChart({ data }: PointsHistoryChartProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!containerRef.current || !svgRef.current) return

    const container = containerRef.current
    const svg = d3.select(svgRef.current)

    const renderChart = () => {
      // Clear previous SVG elements and tooltips
      svg.selectAll("*").remove()
      d3.select(container).selectAll(".chart-tooltip").remove()

      const width = container.clientWidth || 800
      const height = 400
      const margin = { top: 20, right: 30, bottom: 45, left: 48 }

      svg.attr("width", width).attr("height", height)

      const isEmpty = !data || data.length === 0 || data.every(u => u.history.length === 0)

      const getTickLabel = (d: PointsHistoryData): string => {
        if (d.tickLabel) return d.tickLabel
        const r = Math.round(d.round)
        return d.sessionType === "sprint" ? `S${r}` : `R${r}`
      }

      // Build ordered X-axis ticks (e.g. R1, S2, R2, R3, S4, R4, ...)
      let xTicks: string[] = []
      let maxPoints = 0

      if (!isEmpty) {
        const allHistory = data.flatMap(d => d.history)
        maxPoints = d3.max(allHistory, d => d.cumulativePoints) || 0

        const maxRound = d3.max(allHistory, d => Math.round(d.round)) || 1
        const sprintRounds = new Set<number>(SPRINTS.map(s => s.round))
        allHistory.forEach(d => {
          if (d.sessionType === "sprint" || (d.tickLabel && d.tickLabel.startsWith("S"))) {
            sprintRounds.add(Math.round(d.round))
          }
        })

        for (let r = 1; r <= maxRound; r++) {
          if (sprintRounds.has(r)) {
            xTicks.push(`S${r}`)
          }
          xTicks.push(`R${r}`)
        }
      } else {
        xTicks = ["R1", "S2", "R2", "R3", "S4", "R4", "S5", "R5"]
        maxPoints = 100
      }

      // X Scale (Point scale with all R# and S# marks)
      const x = d3.scalePoint<string>()
        .domain(xTicks)
        .range([margin.left, width - margin.right])
        .padding(0.25)

      // Y Scale (Points)
      const y = d3.scaleLinear()
        .domain([0, maxPoints])
        .nice()
        .range([height - margin.bottom, margin.top])

      const yTicks = y.ticks(6)

      // Background Grid (Vertical + Horizontal)
      const gridGroup = svg.append("g").attr("class", "chart-grid")

      // Vertical grid lines for each round/sprint mark
      gridGroup.selectAll("line.grid-v")
        .data(xTicks)
        .join("line")
        .attr("class", "grid-v")
        .attr("x1", d => x(d) ?? margin.left)
        .attr("x2", d => x(d) ?? margin.left)
        .attr("y1", margin.top)
        .attr("y2", height - margin.bottom)
        .attr("stroke", d => d.startsWith("S") ? "rgba(255, 255, 255, 0.06)" : "rgba(255, 255, 255, 0.1)")
        .attr("stroke-width", 1)
        .attr("stroke-dasharray", d => d.startsWith("S") ? "3,3" : "none")

      // Horizontal grid lines for point levels
      gridGroup.selectAll("line.grid-h")
        .data(yTicks)
        .join("line")
        .attr("class", "grid-h")
        .attr("x1", margin.left)
        .attr("x2", width - margin.right)
        .attr("y1", d => y(d))
        .attr("y2", d => y(d))
        .attr("stroke", "rgba(255, 255, 255, 0.08)")
        .attr("stroke-width", 1)

      // Axes
      const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).tickValues(xTicks))
        .call(g => g.select(".domain").attr("stroke", "rgba(255,255,255,0.25)"))
        .call(g => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.2)"))
        .call(g =>
          g.selectAll<SVGTextElement, string>(".tick text")
            .attr("fill", d => d.startsWith("S") ? "rgba(251, 191, 36, 0.85)" : "rgba(255, 255, 255, 0.75)")
            .attr("font-size", "11px")
            .attr("font-weight", d => d.startsWith("S") ? "600" : "700")
        )

      const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y).ticks(6))
        .call(g => g.select(".domain").attr("stroke", "rgba(255,255,255,0.25)"))
        .call(g => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.2)"))
        .call(g => g.selectAll(".tick text").attr("fill", "rgba(255,255,255,0.65)").attr("font-size", "11px"))

      svg.append("g").call(xAxis)
      svg.append("g").call(yAxis)

      if (isEmpty) {
        svg.append("text")
          .attr("x", width / 2)
          .attr("y", height / 2)
          .attr("text-anchor", "middle")
          .attr("fill", "rgba(255,255,255,0.4)")
          .attr("font-size", "14px")
          .attr("font-style", "italic")
          .text("No point history available yet this season")

        return
      }

      // Line generator
      const line = d3.line<PointsHistoryData>()
        .x(d => x(getTickLabel(d)) ?? margin.left)
        .y(d => y(d.cumulativePoints))
        .curve(d3.curveLinear)

      // Draw lines
      const lineGroup = svg.append("g").attr("class", "lines")
      data.forEach(user => {
        if (!user.history || user.history.length === 0) return

        lineGroup.append("path")
          .datum(user.history)
          .attr("fill", "none")
          .attr("stroke", user.color)
          .attr("stroke-width", 2.5)
          .attr("d", line)
          .attr("class", "transition-all duration-300 cursor-pointer")
          .attr("id", `line-${user.userId.replace(/\s+/g, "-")}`)
          .on("mouseover", function () {
            lineGroup.selectAll("path").transition().duration(200).style("opacity", 0.2)
            d3.select(this).transition().duration(200).style("opacity", 1).attr("stroke-width", 3.5)
          })
          .on("mouseout", function () {
            lineGroup.selectAll("path").transition().duration(200).style("opacity", 1).attr("stroke-width", 2.5)
          })
      })

      // Create tooltip
      const tooltip = d3.select(container)
        .append("div")
        .attr("class", "chart-tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "rgba(0, 0, 0, 0.85)")
        .style("color", "white")
        .style("padding", "8px 12px")
        .style("border-radius", "6px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "100")
        .style("border", "1px solid rgba(255, 255, 255, 0.15)")
        .style("backdrop-filter", "blur(4px)")

      // Add dots
      data.forEach(user => {
        if (!user.history || user.history.length === 0) return

        svg.append("g")
          .selectAll("circle")
          .data(user.history)
          .join("circle")
          .attr("cx", d => x(getTickLabel(d)) ?? margin.left)
          .attr("cy", d => y(d.cumulativePoints))
          .attr("r", 4)
          .attr("fill", user.color)
          .attr("stroke", "#000")
          .attr("stroke-width", 1.2)
          .style("cursor", "pointer")
          .on("mouseover", function (_event, d) {
            const label = getTickLabel(d)
            d3.select(this)
              .transition()
              .duration(200)
              .attr("r", 7)
              .attr("stroke-width", 2)

            tooltip
              .style("visibility", "visible")
              .html(`
                <div style="font-weight: bold; color: ${user.color}; margin-bottom: 2px;">${user.username}</div>
                <div style="font-size: 11px; margin-bottom: 4px; color: rgba(255,255,255,0.9);"><span style="font-weight: 700; opacity: 0.8;">${label}</span> • ${d.raceName}</div>
                <div style="font-size: 14px; font-weight: 800;">${d.cumulativePoints} pts</div>
                <div style="font-size: 11px; color: rgba(255,255,255,0.8);">+${d.points} pts</div>
              `)

            lineGroup.selectAll("path").transition().duration(200).style("opacity", 0.2)
            svg.select(`#line-${user.userId.replace(/\s+/g, "-")}`).transition().duration(200).style("opacity", 1).attr("stroke-width", 3.5)
          })
          .on("mousemove", function (event) {
            const [xPos, yPos] = d3.pointer(event, container)
            const tooltipNode = tooltip.node() as HTMLDivElement | null
            const tooltipWidth = tooltipNode?.offsetWidth || 160
            const leftPos = xPos + 15 + tooltipWidth > width ? xPos - tooltipWidth - 15 : xPos + 15
            tooltip
              .style("top", `${Math.max(0, yPos - 10)}px`)
              .style("left", `${Math.max(0, leftPos)}px`)
          })
          .on("mouseout", function () {
            d3.select(this)
              .transition()
              .duration(200)
              .attr("r", 4)
              .attr("stroke-width", 1.2)

            tooltip.style("visibility", "hidden")
            lineGroup.selectAll("path").transition().duration(200).style("opacity", 1).attr("stroke-width", 2.5)
          })
      })
    }

    renderChart()

    const resizeObserver = new ResizeObserver(() => {
      renderChart()
    })
    resizeObserver.observe(container)

    return () => {
      resizeObserver.disconnect()
    }
  }, [data])

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-md relative">
      <CardHeader>
        <CardTitle className="text-xl font-bold uppercase tracking-wider text-white italic shadow-sm border-b border-white/10 pb-4 mb-4 select-none" style={{ textShadow: "0 2px 10px rgba(0, 0, 0, 0.5)" }}>Season Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div ref={containerRef} className="w-full relative">
            <svg ref={svgRef} className="w-full h-[400px]"></svg>
        </div>
      </CardContent>
    </Card>
  )
}
