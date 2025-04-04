"use client"

import { useRef, useEffect } from "react"
import { FuelIcon as GasStation } from "lucide-react"

interface FuelGaugeProps {
  fuelLevel: number // 0-100
}

export default function FuelGauge({ fuelLevel }: FuelGaugeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with higher resolution for retina displays
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const radius = Math.min(centerX, centerY) * 0.85

    // Draw outer circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
    ctx.fillStyle = "#111111"
    ctx.fill()
    ctx.strokeStyle = "#333333"
    ctx.lineWidth = 10
    ctx.stroke()

    // Draw inner circle
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.1, 0, 2 * Math.PI)
    ctx.fillStyle = "#333333"
    ctx.fill()

    // Start angle is at -45 degrees, end angle at 45 degrees (in radians)
    const startAngle = -Math.PI / 4
    const endAngle = Math.PI / 4
    const angleRange = endAngle - startAngle

    // Draw ticks
    ctx.font = "bold 14px Arial"
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"

    // Draw E and F markers
    const eAngle = startAngle
    const fAngle = endAngle

    const eX = centerX + (radius - 30) * Math.cos(eAngle)
    const eY = centerY + (radius - 30) * Math.sin(eAngle)
    ctx.fillText("E", eX, eY)

    const fX = centerX + (radius - 30) * Math.cos(fAngle)
    const fY = centerY + (radius - 30) * Math.sin(fAngle)
    ctx.fillText("F", fX, fY)

    // Draw major ticks
    for (let i = 0; i <= 4; i++) {
      const angle = startAngle + (i / 4) * angleRange
      const tickLength = radius * 0.15

      const innerX = centerX + (radius - tickLength) * Math.cos(angle)
      const innerY = centerY + (radius - tickLength) * Math.sin(angle)
      const outerX = centerX + radius * 0.95 * Math.cos(angle)
      const outerY = centerY + radius * 0.95 * Math.sin(angle)

      ctx.beginPath()
      ctx.moveTo(innerX, innerY)
      ctx.lineTo(outerX, outerY)
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 2
      ctx.stroke()
    }

    // Draw fuel level indicator
    const fuelColor = fuelLevel < 20 ? "#ff3333" : "#33ff33"

    // Draw needle
    const needleAngle = startAngle + (fuelLevel / 100) * angleRange
    const needleLength = radius * 0.8

    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(centerX + needleLength * Math.cos(needleAngle), centerY + needleLength * Math.sin(needleAngle))
    ctx.strokeStyle = fuelColor
    ctx.lineWidth = 4
    ctx.stroke()

    // Draw needle center cap
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.05, 0, 2 * Math.PI)
    ctx.fillStyle = fuelColor
    ctx.fill()

    // Draw fuel icon
    ctx.font = "bold 16px Arial"
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.fillText(`${Math.round(fuelLevel)}%`, centerX, centerY + radius * 0.4)
  }, [fuelLevel])

  return (
    <div className="relative flex flex-col items-center">
      <canvas ref={canvasRef} className="w-[200px] h-[200px]" style={{ width: "200px", height: "200px" }} />
      <div className="absolute bottom-0 flex items-center justify-center text-white">
        <GasStation className="w-5 h-5 mr-1 text-yellow-500" />
      </div>
    </div>
  )
}

