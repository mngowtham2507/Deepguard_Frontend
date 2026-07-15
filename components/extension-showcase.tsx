"use client"

import { motion } from "framer-motion"
import { Chrome, Shield, Image, Video, Zap, Eye, CheckCircle } from "lucide-react"

export default function ExtensionShowcase() {
  const features = [
    {
      icon: Video,
      title: "Auto Video Scanning",
      description: "Automatically scans Instagram and Facebook videos in real-time"
    },
    {
      icon: Image,
      title: "Image Analysis",
      description: "Click-to-scan feature for post images with instant results"
    },
    {
      icon: Eye,
      title: "Biometric Animation",
      description: "Professional face detection scanning with glowing corners"
    },
    {
      icon: Zap,
      title: "Instant Results",
      description: "Get REAL/FAKE detection results in 2-3 seconds"
    },
    {
      icon: Shield,
      title: "Privacy First",
      description: "All analysis done through your local backend API"
    },
    {
      icon: CheckCircle,
      title: "Manual Controls",
      description: "Pause, resume, or stop scanning anytime with control buttons"
    }
  ]

  return (
    <section id="extension-showcase" className="py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16 animate-fade-in"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Chrome className="w-12 h-12 text-primary drop-shadow-lg" />
            <h2 className="text-4xl md:text-5xl font-bold">
              Chrome <span className="text-primary">Extension</span>
            </h2>
          </div>
        </motion.div>

        {/* Extension Preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 animate-slide-up"
        >
          <div className="bg-card border border-border rounded-2xl p-8 shadow-2xl hover:shadow-[0_20px_50px_rgba(var(--primary),0.15)] transition-all duration-500">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left: Extension Info */}
              <div>
                <h3 className="text-2xl font-bold mb-4">DeepGuard Browser Extension</h3>
                <p className="text-foreground/70 mb-6">
                  Seamlessly integrated into your browser, DeepGuard scans videos and images as you browse social media. Click the shield icon on any image or let videos auto-scan for instant deepfake detection.
                </p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform duration-300">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/30 transition-colors">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-primary transition-colors">Continuous Video Monitoring</p>
                      <p className="text-sm text-foreground/70">Scans every 3 seconds while video plays</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform duration-300">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/30 transition-colors">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-primary transition-colors">Click-to-Scan Images</p>
                      <p className="text-sm text-foreground/70">Shield icon appears on post images</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3 group hover:translate-x-1 transition-transform duration-300">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5 group-hover:bg-primary/30 transition-colors">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold group-hover:text-primary transition-colors">Detailed Results on Hover</p>
                      <p className="text-sm text-foreground/70">View confidence, frequency score, processing time</p>
                    </div>
                  </div>
                </div>

                <a
                  href="/chrome-extension/INSTALL.md"
                  target="_blank"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300 hover:scale-105 hover:-translate-y-1"
                >
                  <Chrome className="w-5 h-5" />
                  Installation Guide
                </a>
              </div>

              {/* Right: Visual Representation */}
              <div className="relative">
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg border border-border p-4">
                  <div className="h-full flex flex-col justify-between">
                    {/* Browser Chrome */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="flex gap-1.5">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                      </div>
                      <div className="flex-1 bg-background/50 rounded px-3 py-1 text-xs text-muted-foreground">
                        instagram.com
                      </div>
                    </div>

                    {/* Mock Interface */}
                    <div className="flex-1 bg-background/30 rounded border border-border/50 p-4 relative overflow-hidden">
                      {/* Scan Icon */}
                      <div className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/50 hover:scale-110 transition-transform cursor-pointer">
                        <Shield className="w-6 h-6 text-white" />
                      </div>

                      {/* Result Badge */}
                      <div className="absolute top-3 right-3">
                        <div className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg shadow-green-500/50 animate-fade-in">
                          <CheckCircle className="w-3 h-3" />
                          REAL
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="absolute bottom-3 left-3 flex gap-2">
                        <div className="w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center">
                          <div className="w-2 h-2 bg-primary rounded-sm"></div>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-background/80 border border-border flex items-center justify-center">
                          <Eye className="w-4 h-4 text-primary" />
                        </div>
                      </div>

                      {/* Mock Image */}
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground/30">
                        <div className="text-center">
                          <Video className="w-12 h-12 mx-auto mb-2" />
                          <p className="text-xs">Social Media Content</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-xl p-6 shadow-lg hover:shadow-2xl hover:shadow-primary/20 transition-all duration-300 group hover:-translate-y-1"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors group-hover:scale-110 transition-transform">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-foreground/70 text-sm">{feature.description}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
