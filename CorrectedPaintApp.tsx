"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Brush, Eraser, Download, Undo, Redo, Palette } from "lucide-react"

const colors = [
  "#000000",
  "#374151",
  "#EF4444",
  "#F97316",
  "#EAB308",
  "#22C55E",
  "#06B6D4",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F43F5E",
  "#84CC16",
  "#FFFFFF",
  "#9CA3AF",
  "#FCA5A5",
  "#FED7AA",
  "#FEF3C7",
  "#BBF7D0",
  "#A7F3D0",
  "#BFDBFE",
  "#C4B5FD",
  "#F9A8D4",
  "#FCA5A5",
  "#D9F99D",
]

export default function Component() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [color, setColor] = useState("#000000")
  const [tool, setTool] = useState("brush")
  const [brushSize, setBrushSize] = useState(3)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      context.fillStyle = "#FFFFFF"
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
  }, [])

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      context.beginPath()
      context.moveTo(x, y)
      setIsDrawing(true)
    }
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      const rect = canvas.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      context.lineTo(x, y)
      context.strokeStyle = tool === "eraser" ? "#FFFFFF" : color
      context.lineWidth = tool === "eraser" ? brushSize * 3 : brushSize
      context.lineCap = "round"
      context.lineJoin = "round"
      context.stroke()
    }
  }

  const stopDrawing = () => {
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = canvas?.getContext("2d")
    if (context) {
      context.fillStyle = "#FFFFFF"
      context.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  const downloadCanvas = () => {
    const canvas = canvasRef.current
    if (canvas) {
      const link = document.createElement("a")
      link.download = "my-drawing.png"
      link.href = canvas.toDataURL()
      link.click()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div
        ref={containerRef}
        className="mx-auto max-w-6xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="w-6 h-6 text-blue-400" />
              <h1 className="text-xl font-semibold">Modern Paint</h1>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700" onClick={downloadCanvas}>
                <Download className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-white hover:bg-slate-700" onClick={clearCanvas}>
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Toolbar */}
        <div className="bg-slate-50 border-b border-slate-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Tools */}
              <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm border border-slate-200">
                <Button
                  variant={tool === "brush" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTool("brush")}
                  className="flex items-center gap-2"
                >
                  <Brush className="w-4 h-4" />
                  Brush
                </Button>
                <Button
                  variant={tool === "eraser" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTool("eraser")}
                  className="flex items-center gap-2"
                >
                  <Eraser className="w-4 h-4" />
                  Eraser
                </Button>
              </div>

              {/* Brush Size */}
              <div className="flex items-center gap-2 bg-white rounded-lg p-2 shadow-sm border border-slate-200">
                <span className="text-sm font-medium text-slate-600">Size:</span>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={(e) => setBrushSize(Number(e.target.value))}
                  className="w-20"
                />
                <span className="text-sm text-slate-500 w-6">{brushSize}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Undo className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Redo className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Canvas Area */}
        <div className="flex">
          {/* Color Palette */}
          <div className="w-20 bg-slate-50 border-r border-slate-200 p-3">
            <div className="space-y-2">
              <h3 className="text-xs font-semibold text-slate-600 mb-3">Colors</h3>
              <div className="grid grid-cols-2 gap-1">
                {colors.map((c) => (
                  <button
                    key={c}
                    className={`w-7 h-7 rounded-lg border-2 transition-all hover:scale-110 ${
                      color === c ? "border-slate-400 shadow-md" : "border-slate-200"
                    }`}
                    style={{ backgroundColor: c }}
                    onClick={() => setColor(c)}
                  />
                ))}
              </div>

              {/* Current Color Display */}
              <div className="mt-4 p-2 bg-white rounded-lg border border-slate-200">
                <div className="text-xs text-slate-600 mb-1">Current</div>
                <div className="w-full h-8 rounded border border-slate-200" style={{ backgroundColor: color }} />
              </div>
            </div>
          </div>

          {/* Canvas */}
          <div className="flex-1 bg-white">
            <div className="p-4">
              <div className="border-2 border-dashed border-slate-200 rounded-lg overflow-hidden bg-white shadow-inner">
                <canvas
                  ref={canvasRef}
                  width={800}
                  height={600}
                  className="block cursor-crosshair"
                  onMouseDown={startDrawing}
                  onMouseMove={draw}
                  onMouseUp={stopDrawing}
                  onMouseOut={stopDrawing}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-slate-600">
            <div className="flex items-center gap-4">
              <span>Tool: {tool === "brush" ? "Brush" : "Eraser"}</span>
              <span>Size: {brushSize}px</span>
              <span>Color: {color}</span>
            </div>
            <div>Canvas: 800 × 600px</div>
          </div>
        </div>
      </div>
    </div>
  )
}
