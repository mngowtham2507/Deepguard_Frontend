"use client"

import Image from "next/image"
import { Shield, Zap, Lock } from "lucide-react"

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-border bg-card">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section with Features */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <Image 
                  src="/images/Logo.jpg" 
                  alt="DeepGuard Logo" 
                  width={40} 
                  height={40}
                  className="rounded-lg"
                />
              </div>
              <span className="font-bold text-xl text-foreground">DeepGuard</span>
            </div>
            <p className="text-foreground/60 text-sm mb-6 max-w-md">
              Advanced AI-powered deepfake detection technology. Protect you from synthetic media and misinformation with industry-leading accuracy.
            </p>
            
            {/* Key Features */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Shield className="w-4 h-4 text-primary" />
                <span>97.73% Detection Accuracy</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Zap className="w-4 h-4 text-primary" />
                <span>Real-time Analysis</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-foreground/70">
                <Lock className="w-4 h-4 text-primary" />
                <span>Secure & Private</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <a href="#features" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#detection-demo" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  How It Works
                </a>
              </li>
              <li>
                <a href="#demo" className="text-sm text-foreground/60 hover:text-primary transition-colors">
                  Try Demo
                </a>
              </li>
            </ul>
          </div>

          {/* Technology */}
          <div>
            <h4 className="font-semibold text-foreground mb-4">Technology</h4>
            <ul className="space-y-2 text-sm text-foreground/60">
              <li>ResNet50 AI Model</li>
              <li>MTCNN Face Detection</li>
              <li>Frequency Analysis</li>
              <li>Neural Networks</li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-border py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-foreground/50">
              &copy; {currentYear} DeepGuard. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-foreground/50">
              <span>Built with AI Technology</span>
              <span className="hidden sm:inline">•</span>
              <span>Made for Security</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
