"use client"

import { useEffect, useState } from "react"

interface GridNode {
  x: number
  y: number
  opacity: number
}

export default function AnimatedGrid() {
  const [nodes, setNodes] = useState<GridNode[]>([])

  useEffect(() => {
    const gridNodes: GridNode[] = []
    const cols = 8
    const rows = 6

    for (let i = 0; i < cols * rows; i++) {
      gridNodes.push({
        x: (i % cols) * (100 / cols),
        y: Math.floor(i / cols) * (100 / rows),
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    setNodes(gridNodes)

    const interval = setInterval(() => {
      setNodes((prev) =>
        prev.map((node) => ({
          ...node,
          opacity: Math.random() * 0.5 + 0.2,
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {nodes.map((node, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary rounded-full transition-opacity duration-1000"
          style={{
            left: `${node.x}%`,
            top: `${node.y}%`,
            opacity: node.opacity,
          }}
        />
      ))}
    </div>
  )
}
