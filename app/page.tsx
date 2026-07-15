"use client"
import Header from "@/components/header"
import Hero from "@/components/hero"
import Features from "@/components/features"
import DetectionDemo from "@/components/detection-demo"
import DetectionProcess from "@/components/detection-process"
import ExtensionShowcase from "@/components/extension-showcase"
import Footer from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <Hero />
      <Features />
      <DetectionDemo />
      <DetectionProcess />
      <ExtensionShowcase />
      <Footer />
    </main>
  )
}
