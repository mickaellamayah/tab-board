"use client"

import { useRef, useEffect } from "react"

interface SpeedometerProps {
  speed: number
  maxSpeed: number
}

export default function Speedometer({ speed, maxSpeed }: SpeedometerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    
    const ctx = canvas.getContext("2d");
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
    
    // Draw ticks and numbers
    ctx.font = "bold 16px Arial"
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    
    // Start angle is at -135 degrees, end angle at 135 degrees (in radians)
    const startAngle = -3 * Math.PI / 4
    const endAngle = 3 * Math.PI / 4
    const angleRange = endAngle - startAngle
    
    // Draw major ticks and numbers
    for (let i = 0; i <= maxSpeed; i += 20) {
      const angle = startAngle + (i / maxSpeed) * angleRange
      const tickLength = radius * 0.15
      
      const innerX = centerX + (radius - tickLength) * Math.cos(angle)
      const innerY = centerY + (radius - tickLength) * Math.sin(angle)
      const outerX = centerX + radius * 0.95 * Math.cos(angle)
      const outerY = centerY + radius * 0.95 * Math.sin(angle)
      
      // Draw tick
      ctx.beginPath()
      ctx.moveTo(innerX, innerY)
      ctx.lineTo(outerX, outerY)
      ctx.strokeStyle = "#ffffff"
      ctx.lineWidth = 3
      ctx.stroke()
      
      // Draw number
      const textX = centerX + (radius - tickLength - 20) * Math.cos(angle)
      const textY = centerY + (radius - tickLength - 20) * Math.sin(angle)
      ctx.fillText(i.toString(), textX, textY)
    }
    
    // Draw minor ticks
    for (let i = 0; i <= maxSpeed; i += 10) {
      if (i % 20 !== 0) {
        const angle = startAngle + (i / maxSpeed) * angleRange
        const tickLength = radius * 0.08
        
        const innerX = centerX + (radius - tickLength) * Math.cos(angle)
        const innerY = centerY + (radius - tickLength) * Math.sin(angle)
        const outerX = centerX + radius * 0.95 * Math.cos(angle)
        const outerY = centerY + radius * 0.95 * Math.sin(angle)
        
        ctx.beginPath()
        ctx.moveTo(innerX, innerY)
        ctx.lineTo(outerX, outerY)
        ctx.strokeStyle = "#ffffff"
        ctx.lineWidth = 1.5
        ctx.stroke()
      }
    }
    
    // Draw speed text
    ctx.font = "bold 24px Arial"
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.fillText(`${Math.round(speed)}`, centerX, centerY + radius * 0.4)
    
    ctx.font = "14px Arial"
    ctx.fillStyle = "#999999"
    ctx.fillText("km/h", centerX, centerY + radius * 0.55)
    
    // Draw needle
    const needleAngle = startAngle + (speed / maxSpeed) * angleRange
    const needleLength = radius * 0.8
    
    ctx.beginPath()
    ctx.moveTo(centerX, centerY)
    ctx.lineTo(
      centerX + needleLength * Math.cos(needleAngle),
      centerY + needleLength * Math.sin(needleAngle)
    )
    ctx.strokeStyle = "#ff3333"
    ctx.lineWidth = 4
    ctx.stroke()
    
    // Draw needle center cap
    ctx.beginPath()
    ctx.arc(centerX, centerY, radius * 0.05, 0, 2 * Math.PI)
    ctx.fillStyle = "#ff3333"
    ctx.fill()
    
  }, [speed, maxSpeed])
  
  return (
    <div className="relative">
      <canvas 
        ref={canvasRef} 
        className="w-[300px] h-[300px]"
        style={{ width: "300px", height: "300px" }}
      />
    </div>
  )
}
