"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-xl group-hover:shadow-primary/30 transition-all duration-300 group-hover:scale-110">
            <Image 
              src="/images/Logo.jpg" 
              alt="DeepGuard Logo" 
              width={40} 
              height={40}
              className="rounded-lg"
            />
          </div>
          <span className="font-bold text-2xl text-primary group-hover:scale-105 transition-transform">
            DeepGuard
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-foreground/70 hover:text-foreground transition-all font-medium hover:scale-110 duration-200">
            Features
          </a>
          <a href="#detection-demo" className="text-foreground/70 hover:text-foreground transition-all font-medium hover:scale-110 duration-200">
            How It Works
          </a>
          <a href="#demo" className="text-foreground/70 hover:text-foreground transition-all font-medium hover:scale-110 duration-200">
            Demo
          </a>
        </div>

        <div className="hidden md:flex gap-3">
          <Button 
            className="bg-primary hover:bg-primary/90 text-white shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
            onClick={() => {
              const demoSection = document.getElementById("demo")
              demoSection?.scrollIntoView({ behavior: "smooth" })
            }}
          >
            Try Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-md">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block text-foreground/70 hover:text-foreground py-2">
              Features
            </a>
            <a href="#detection-demo" className="block text-foreground/70 hover:text-foreground py-2">
              How It Works
            </a>
            <a href="#demo" className="block text-foreground/70 hover:text-foreground py-2">
              Demo
            </a>
            <div className="pt-2">
              <Button 
                className="w-full bg-primary hover:bg-primary/90 text-white"
                onClick={() => {
                  const demoSection = document.getElementById("demo")
                  demoSection?.scrollIntoView({ behavior: "smooth" })
                  setIsOpen(false)
                }}
              >
                Try Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}