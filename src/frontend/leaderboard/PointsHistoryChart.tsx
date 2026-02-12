import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/frontend/components/card"
import * as d3 from "d3"

export interface PointsHistoryData {
  round: number
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
    if (!data || data.length === 0 || !containerRef.current || !svgRef.current) return

    const container = containerRef.current
    const svg = d3.select(svgRef.current)
    
    // Clear previous
    svg.selectAll("*").remove()

    const width = container.clientWidth
    const height = 400
    const margin = { top: 20, right: 30, bottom: 40, left: 40 }

    svg.attr("width", width).attr("height", height)

    // Scales
    const allHistory = data.flatMap(d => d.history)
    const maxPoints = d3.max(allHistory, d => d.cumulativePoints) || 0
    const rounds = Array.from(new Set(allHistory.map(d => d.round))).sort((a, b) => a - b)
    
    // X Scale (Rounds)
    const x = d3.scaleLinear()
        .domain([1, d3.max(rounds) || 1])
        .range([margin.left, width - margin.right])

    // Y Scale (Points)
    const y = d3.scaleLinear()
        .domain([0, maxPoints])
        .nice()
        .range([height - margin.bottom, margin.top])

    // Line generator
    const line = d3.line<PointsHistoryData>()
        .x(d => x(d.round))
        .y(d => y(d.cumulativePoints))
        .curve(d3.curveMonotoneX)

    // Axes
    const xAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x).ticks(rounds.length).tickFormat((d) => `Round ${d}`))
        .call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.2)"))
        .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.1)"))
        .call((g) => g.selectAll(".tick text").attr("fill", "rgba(255,255,255,0.6)"))

    const yAxis = (g: d3.Selection<SVGGElement, unknown, null, undefined>) => g
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(y))
        .call((g) => g.select(".domain").attr("stroke", "rgba(255,255,255,0.2)"))
        .call((g) => g.selectAll(".tick line").attr("stroke", "rgba(255,255,255,0.1)"))
        .call((g) => g.selectAll(".tick text").attr("fill", "rgba(255,255,255,0.6)"))

    svg.append("g").call(xAxis)
    svg.append("g").call(yAxis)

    // Draw lines
    const lineGroup = svg.append("g").attr("class", "lines")
    data.forEach(user => {
        lineGroup.append("path")
            .datum(user.history)
            .attr("fill", "none")
            .attr("stroke", user.color)
            .attr("stroke-width", 2)
            .attr("d", line)
            .attr("class", "transition-all duration-300 hover:stroke-[3px]")
            .attr("id", `line-${user.userId.replace(/\s+/g, '-')}`)
    })

    // Create tooltip
    const tooltip = d3.select(container)
        .append("div")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("background-color", "rgba(0, 0, 0, 0.8)")
        .style("color", "white")
        .style("padding", "8px 12px")
        .style("border-radius", "6px")
        .style("font-size", "12px")
        .style("pointer-events", "none")
        .style("z-index", "100")
        .style("border", "1px solid rgba(255, 255, 255, 0.1)")
        .style("backdrop-filter", "blur(4px)")

    // Add dots
    data.forEach(user => {
        svg.append("g")
            .selectAll("circle")
            .data(user.history)
            .join("circle")
            .attr("cx", d => x(d.round))
            .attr("cy", d => y(d.cumulativePoints))
            .attr("r", 4)
            .attr("fill", user.color)
            .attr("stroke", "#000")
            .attr("stroke-width", 1)
            .style("cursor", "pointer")
            .on("mouseover", function(_event, d) {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 7)
                    .attr("stroke-width", 2)

                tooltip
                    .style("visibility", "visible")
                    .html(`
                        <div style="font-weight: bold; color: ${user.color}; margin-bottom: 2px;">${user.username}</div>
                        <div style="font-size: 14px; font-weight: 800;">${d.cumulativePoints} pts</div>
                        <div style="font-size: 11px; color: rgba(255,255,255,0.8);">+${d.points} pts</div>
                    `)
                
                // Dim other lines, highlight this one
                svg.selectAll("path").transition().duration(200).style("opacity", 0.2)
                svg.select(`#line-${user.userId.replace(/\s+/g, '-')}`).transition().duration(200).style("opacity", 1).attr("stroke-width", 3)
            })
            .on("mousemove", function(event) {
                const [x, y] = d3.pointer(event, container)
                tooltip
                    .style("top", (y - 10) + "px")
                    .style("left", (x + 15) + "px")
            })
            .on("mouseout", function() {
                d3.select(this)
                    .transition()
                    .duration(200)
                    .attr("r", 4)
                    .attr("stroke-width", 1)

                tooltip.style("visibility", "hidden")
                
                // Restore all lines
                svg.selectAll("path").transition().duration(200).style("opacity", 1).attr("stroke-width", 2)
            })
    })

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
