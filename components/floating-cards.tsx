"use client"

import { useEffect, useState } from "react"
import { Brain, Shield, Zap } from "lucide-react"

const cards = [
  {
    icon: Brain,
    label: "Neural Analysis",
    color: "from-primary/20 to-primary/5",
  },
  {
    icon: Shield,
    label: "Secure Detection",
    color: "from-accent/20 to-accent/5",
  },
  {
    icon: Zap,
    label: "Real-Time Processing",
    color: "from-primary/20 to-accent/10",
  },
]

export default function FloatingCards() {
  const [positions, setPositions] = useState<Array<{ x: number; y: number }>>([])

  useEffect(() => {
    setPositions(
      cards.map(() => ({
        x: Math.random() * 100,
        y: Math.random() * 100,
      })),
    )

    const interval = setInterval(() => {
      setPositions((prev) =>
        prev.map(() => ({
          x: Math.random() * 100,
          y: Math.random() * 100,
        })),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute inset-0 overflow-hidden -z-10">
      {cards.map((card, i) => {
        const Icon = card.icon
        const pos = positions[i]

        return (
          <div
            key={i}
            className={`absolute w-32 h-32 rounded-2xl bg-gradient-to-br ${card.color} border border-primary/10 flex items-center justify-center transition-all duration-5000 opacity-40 hover:opacity-60`}
            style={{
              left: `${pos?.x}%`,
              top: `${pos?.y}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Icon size={48} className="text-primary/50" />
          </div>
        )
      })}
    </div>
  )
}
