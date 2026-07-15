"use client"

import { useEffect, useRef, useState } from "react"
import { Upload, ScanFace, Brain, Shield, CheckCircle2 } from "lucide-react"

export default function DetectionProcess() {
  const [activeStep, setActiveStep] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 5)
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const steps = [
    {
      title: "Upload Image",
      description: "Upload your image for analysis",
      icon: Upload,
    },
    {
      title: "Face Detection",
      description: "AI detects facial regions",
      icon: ScanFace,
    },
    {
      title: "Deep Analysis",
      description: "Neural network examines features",
      icon: Brain,
    },
    {
      title: "Verification",
      description: "Detect manipulation patterns",
      icon: Shield,
    },
    {
      title: "Results",
      description: "Get detailed confidence report",
      icon: CheckCircle2,
    },
  ]

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-3xl sm:text-4xl font-bold mb-3 text-foreground animate-slide-up">
            Detection Process
          </h2>
          <p className="text-sm text-foreground/60 max-w-xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Advanced ResNet50 AI analyzes images in 5 simple steps with 97.73% accuracy
          </p>
        </div>

        {/* Desktop View - Cards with Line */}
        <div className="hidden md:block">
          <div ref={containerRef} className="relative">
            {/* Progress Line */}
            <div className="absolute top-10 left-0 right-0 h-0.5 bg-border -z-10">
              <div 
                className="h-full bg-primary transition-all duration-500"
                style={{ width: `${(activeStep / (steps.length - 1)) * 100}%` }}
              />
            </div>

            <div className="grid grid-cols-5 gap-3">
              {steps.map((step, index) => {
                const Icon = step.icon
                const isActive = activeStep === index
                const isPast = index < activeStep

                return (
                  <div key={index} className="flex flex-col items-center animate-slide-up" style={{ animationDelay: `${index * 0.1}s` }}>
                    {/* Icon Circle */}
                    <div
                      className={`w-20 h-20 rounded-xl flex items-center justify-center transition-all duration-500 mb-3 ${
                        isActive
                          ? "bg-primary text-white shadow-2xl shadow-primary/50 scale-110"
                          : isPast
                          ? "bg-primary/10 text-primary shadow-lg"
                          : "bg-card border border-border text-foreground/40"
                      }`}
                    >
                      <Icon className={`w-8 h-8 transition-transform duration-500 ${isActive ? 'scale-110' : ''}`} strokeWidth={2} />
                    </div>

                    {/* Step Info */}
                    <div className="text-center">
                      <h3 className={`font-semibold text-sm mb-1 transition-colors duration-300 ${
                        isActive ? "text-primary" : "text-foreground/60"
                      }`}>
                        {step.title}
                      </h3>
                      <p className="text-xs text-foreground/50">
                        {step.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Mobile View - Vertical Cards */}
        <div className="md:hidden space-y-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            const isActive = activeStep === index

            return (
              <div key={index}>
                <div
                  className={`p-4 rounded-lg border transition-all duration-300 ${
                    isActive
                      ? "bg-primary border-primary text-white"
                      : "bg-card border-border"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                      isActive ? "bg-white/20" : "bg-muted"
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-sm mb-0.5">{step.title}</h3>
                      <p className={`text-xs ${
                        isActive ? "text-white/80" : "text-foreground/60"
                      }`}>
                        {step.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
