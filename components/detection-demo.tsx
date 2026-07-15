"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, CheckCircle, AlertCircle, Loader } from "lucide-react"
// Replaced LaptopDetectionScreen with inline loader visual

export default function DetectionDemo() {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<null | { 
    isDeepfake: boolean; 
    confidence: number;
    realProb: number;
    fakeProb: number;
    processingTime: number;
    numFaces?: number;
    gradcamImage?: string;
    explanation?: {
      summary: string;
      confidence_level: string;
      indicators: string[];
      technical_details: string[];
    };
  }>(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [error, setError] = useState<string | null>(null)
  const [loadingGradcam, setLoadingGradcam] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const parseApiResponse = async (response: Response) => {
    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      return response.json().catch(() => null)
    }

    const text = await response.text().catch(() => '')
    return text ? { error: text } : null
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (sectionRef.current) {
      const rect = sectionRef.current.getBoundingClientRect()
      setMousePosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    }
  }

  const fetchGradcam = async (file: File) => {
    try {
      setLoadingGradcam(true)
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/gradcam', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setResult(prev => prev ? { ...prev, gradcamImage: data.gradcam_image } : null)
      }
    } catch (err) {
      console.error('Grad-CAM error:', err)
    } finally {
      setLoadingGradcam(false)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Display uploaded image
    const reader = new FileReader()
    reader.onload = (event) => {
      setUploadedImage(event.target?.result as string)
    }
    reader.readAsDataURL(file)

    setIsAnalyzing(true)
    setResult(null)
    setError(null)

    try {
      // Create FormData and send to Flask backend
      const formData = new FormData()
      formData.append('file', file)

      console.log('Sending request to backend...')

      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      })

      console.log('Response status:', response.status)

      const data = await parseApiResponse(response)
      console.log('Response data:', data)

      if (!response.ok) {
        throw new Error(data?.error || data?.message || `Server error: ${response.status}`)
      }
      
      // Transform backend response to frontend format
      const resultData = {
        isDeepfake: data.label === 'FAKE',
        confidence: data.confidence,
        realProb: data.probabilities?.REAL || 0,
        fakeProb: data.probabilities?.FAKE || 0,
        processingTime: data.processing_time || 0,
        explanation: data.explanation || undefined,
      }
      
      console.log('Setting result:', resultData)
      setResult(resultData)
      
      // Fetch Grad-CAM heatmap for detailed analysis
      if (data.label === 'FAKE') {
        fetchGradcam(file)
      }
      
      // Scroll to result after a short delay to allow rendering
      setTimeout(() => {
        resultRef.current?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }, 300)
    } catch (err) {
      console.error('Detection error:', err)
      setError(err instanceof Error ? err.message : 'Failed to analyze image. Make sure the backend server is running.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
        <section
      id="demo"
      className="pt-16 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-linear-to-b from-white to-blue-50/30"
    >
      {/* Static background blobs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl -z-10 animate-pulse" />

      {/* Interactive blob that follows mouse */}
      <div
        className="absolute w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -z-10 pointer-events-none transition-all duration-200 ease-out"
        style={{
          left: `${mousePosition.x - 128}px`,
          top: `${mousePosition.y - 128}px`,
          opacity: 0.6,
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/3 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl -z-10 animate-[float_6s_ease-in-out_infinite]" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-[float_8s_ease-in-out_infinite] [animation-delay:2s]" />

      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl sm:text-6xl font-extrabold mb-6 text-foreground animate-slide-up">
            See <span className="text-primary">AI Detection</span> in Action
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Upload any image and watch our AI analyze it in <span className="font-semibold text-primary">real-time</span>. 
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="flex justify-center">
            {uploadedImage && !isAnalyzing ? (
              <div className="relative">
                <img
                  src={uploadedImage || "/placeholder.svg"}
                  alt="Uploaded"
                  className="w-64 h-64 rounded-2xl object-cover border-4 border-blue-200 shadow-2xl"
                />
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/50 animate-pulse" />
              </div>
            ) : isAnalyzing ? (
              <div className="relative w-80 h-80 rounded-2xl border-2 border-primary/40 overflow-hidden bg-black shadow-2xl">
                {/* Uploaded Image */}
                {uploadedImage && (
                  <img
                    src={uploadedImage}
                    alt="Analyzing"
                    className="w-full h-full object-cover opacity-90"
                  />
                )}
                
                {/* Scanning effects */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {/* Primary scan line with strong glow */}
                  <div 
                    className="absolute inset-x-0 h-1 bg-primary shadow-[0_0_15px_4px_rgba(59,130,246,1),0_0_30px_8px_rgba(59,130,246,0.5)] animate-[scan-vertical_3s_ease-in-out_infinite] z-10"
                  />
                  
                  {/* Scan glow trail effect - larger and more visible */}
                  <div 
                    className="absolute inset-x-0 h-32 bg-linear-to-b from-transparent via-primary/30 to-transparent animate-[scan-vertical_3s_ease-in-out_infinite] blur-sm"
                    style={{ marginTop: '-64px' }}
                  />
                  
                  {/* Secondary faster scan for depth */}
                  <div 
                    className="absolute inset-x-0 h-px bg-cyan-400/80 shadow-[0_0_10px_2px_rgba(6,182,212,0.8)] animate-[scan-vertical_2s_linear_infinite]"
                  />
                  
                  {/* Vertical scanning lines */}
                  <div 
                    className="absolute inset-y-0 w-px bg-primary/40 shadow-[0_0_8px_2px_rgba(59,130,246,0.5)] animate-[scan-horizontal_4s_ease-in-out_infinite]"
                  />
                  
                  {/* Animated grid for tech feel */}
                  <div 
                    className="absolute inset-0 opacity-20 animate-pulse"
                    style={{
                      backgroundImage: 'linear-gradient(to right, rgba(59, 130, 246, 0.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(59, 130, 246, 0.4) 1px, transparent 1px)',
                      backgroundSize: '25px 25px',
                      animation: 'pulse 3s ease-in-out infinite'
                    }}
                  />
                  
                  {/* Scanning wave effect */}
                  <div 
                    className="absolute inset-0 bg-linear-to-b from-primary/0 via-primary/20 to-primary/0 animate-[scan-wave_4s_ease-in-out_infinite]"
                  />
                </div>
                
                {/* Blue tint overlay for scanner effect */}
                <div className="absolute inset-0 bg-linear-to-b from-blue-500/15 via-transparent to-cyan-500/15 pointer-events-none" />
                
                {/* Corner frame - animated */}
                <div className="absolute top-3 left-3 w-8 h-8 border-t-2 border-l-2 border-primary shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-[corner-pulse_2s_ease-in-out_infinite]" />
                <div className="absolute top-3 right-3 w-8 h-8 border-t-2 border-r-2 border-primary shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-[corner-pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '0.5s' }} />
                <div className="absolute bottom-3 left-3 w-8 h-8 border-b-2 border-l-2 border-primary shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-[corner-pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '1s' }} />
                <div className="absolute bottom-3 right-3 w-8 h-8 border-b-2 border-r-2 border-primary shadow-[0_0_8px_rgba(59,130,246,0.8)] animate-[corner-pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '1.5s' }} />
                
                {/* Top status bar with data */}
                <div className="absolute top-0 left-0 right-0 bg-linear-to-b from-black/80 to-transparent px-4 py-3 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-primary rounded-full animate-pulse shadow-[0_0_6px_rgba(59,130,246,1)]" />
                      <span className="text-white font-semibold">SCANNING ACTIVE</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-primary font-mono">ResNet50</span>
                      <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    </div>
                  </div>
                  
                  {/* Mini progress indicators */}
                  <div className="flex gap-1 mt-2">
                    <div className="h-0.5 flex-1 bg-primary/30 rounded-full overflow-hidden">
                      <div className="h-full bg-primary rounded-full animate-[progress_1s_ease-in-out_infinite]" />
                    </div>
                    <div className="h-0.5 flex-1 bg-cyan-400/30 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-400 rounded-full animate-[progress_1.5s_ease-in-out_infinite]" />
                    </div>
                    <div className="h-0.5 flex-1 bg-blue-400/30 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-400 rounded-full animate-[progress_1.2s_ease-in-out_infinite]" />
                    </div>
                  </div>
                </div>
                
                {/* Bottom analysis panel - enhanced */}
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/90 via-black/70 to-transparent p-4 backdrop-blur-sm">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="relative">
                      <Loader size={20} className="text-primary animate-spin" />
                      <div className="absolute inset-0 animate-ping opacity-75">
                        <div className="w-5 h-5 border-2 border-primary rounded-full" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-white mb-0.5">ResNet50 AI Processing</p>
                      <p className="text-xs text-gray-300 font-mono">Analyzing 2048 deep features...</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-primary font-mono font-semibold">97.73%</p>
                      <p className="text-[10px] text-gray-400">Accuracy</p>
                    </div>
                  </div>
                  
                  {/* Enhanced progress bar with segments */}
                  <div className="relative h-2 bg-black/50 rounded-full overflow-hidden border border-primary/30">
                    <div className="absolute inset-0 h-full bg-linear-to-r from-primary via-accent to-cyan-400 animate-[progress_2.5s_ease-in-out_infinite] shadow-[0_0_12px_rgba(59,130,246,0.8)]" />
                    {/* Progress segments */}
                    <div className="absolute inset-0 flex gap-0.5">
                      <div className="flex-1 border-r border-black/30" />
                      <div className="flex-1 border-r border-black/30" />
                      <div className="flex-1 border-r border-black/30" />
                      <div className="flex-1" />
                    </div>
                  </div>
                </div>
                
                {/* Outer frame with pulsing glow */}
                <div className="absolute inset-0 rounded-2xl border-2 border-primary/60 shadow-[0_0_20px_rgba(59,130,246,0.6)] animate-[border-glow_2s_ease-in-out_infinite] pointer-events-none" />
              </div>
            ) : (
              <div className="w-64 h-64 rounded-2xl bg-linear-to-br from-primary/10 to-accent/10 border-2 border-dashed border-primary/30 flex items-center justify-center">
                <div className="text-center">
                  <Upload size={48} className="text-primary/50 mx-auto mb-2" />
                  <p className="text-sm text-foreground/50">Upload to scan</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="bg-card border-2 border-dashed border-primary/30 rounded-2xl p-8 text-center hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/20 hover:scale-105 transition-all duration-300 group animate-slide-up" style={{ animationDelay: '0.2s' }}>
              <div className="mb-6">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 group-hover:shadow-xl group-hover:shadow-primary/40 group-hover:scale-110 transition-all duration-300">
                  <Upload size={32} className="text-primary group-hover:scale-110 transition-transform" />
                </div>
                <h3 className="text-2xl font-semibold mb-2 group-hover:text-primary transition-colors">Upload Media</h3>
                <p className="text-foreground/60 mb-6">Drag and drop or click to select an image or video file</p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <Button
                onClick={() => fileInputRef.current?.click()}
                className="bg-primary hover:bg-primary/90 mb-4 shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/50 hover:scale-105 hover:-translate-y-1 transition-all duration-300"
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <>
                    <Loader size={20} className="mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Upload size={20} className="mr-2 transition-transform group-hover:translate-y-[-2px]" />
                    Choose File
                  </>
                )}
              </Button>

              {error && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle size={20} className="text-destructive mt-0.5 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-destructive">{error}</p>
                      {error.includes('No face detected') ? (
                        <p className="text-xs text-destructive/70 mt-1">
                          Please upload an image that contains a clear, visible face. Try:
                          <br />• Using a well-lit photo
                          <br />• Making sure the face is not blurred or obscured
                          <br />• Uploading a different image
                        </p>
                      ) : error.includes('Server error') || error.includes('Failed to fetch') ? (
                        <p className="text-xs text-destructive/70 mt-1">
                          Make sure the Flask server is running:
                          <br />• Open terminal in backend folder
                          <br />• Run: python app.py
                        </p>
                      ) : (
                        <p className="text-xs text-destructive/70 mt-1">
                          Please try again or contact support if the issue persists.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {result && (
              <div
                ref={resultRef}
                className={`p-8 rounded-2xl border-2 animate-in fade-in slide-in-from-bottom-4 shadow-lg ${
                  result.isDeepfake ? "bg-destructive/10 border-destructive/30" : "bg-green-500/10 border-green-500/30"
                }`}
              >
                <div className="flex items-center justify-center gap-4 mb-6">
                  {result.isDeepfake ? (
                    <>
                      <div className="relative">
                        <AlertCircle size={32} className="text-destructive animate-pulse" />
                        <div className="absolute inset-0 rounded-full bg-destructive/20 animate-ping" />
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-destructive block">Deepfake Detected</span>
                        <span className="text-sm text-destructive/70">High risk content identified</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <CheckCircle size={32} className="text-green-500 animate-pulse" />
                        <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping" />
                      </div>
                      <div className="text-center">
                        <span className="text-2xl font-bold text-green-500 block">Authentic Media</span>
                        <span className="text-sm text-green-500/70">Verified genuine content</span>
                      </div>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-foreground/70 font-medium">Confidence Score</span>
                    <span className="text-2xl font-bold">{result.confidence.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-foreground/10 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-1000 rounded-full ${
                        result.isDeepfake ? "bg-destructive" : "bg-green-600"
                      }`}
                      style={{ width: `${result.confidence}%` }}
                    />
                  </div>
                  
                  {/* Animated Confidence Meter */}
                 
                  
                  {/* Quick Stats */}
                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                      <div className="text-sm font-medium text-foreground/70">Real</div>
                      <div className="text-xl font-bold text-green-500">{result.realProb.toFixed(1)}%</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                      <div className="text-sm font-medium text-foreground/70">Fake</div>
                      <div className="text-xl font-bold text-destructive">{result.fakeProb.toFixed(1)}%</div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-3 rounded-lg bg-card/50">
                      <div className="text-lg font-bold text-foreground">Analysis Time</div>
                      <div className="text-sm text-foreground/60">{result.processingTime.toFixed(2)}s</div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-card/50">
                      <div className="text-lg font-bold text-foreground">Model Accuracy</div>
                      <div className="text-sm text-foreground/60">97.73%</div>
                    </div>
                  </div>

                  {/* Grad-CAM Heatmap for Deepfakes */}
                  {result.isDeepfake && (
                    <div className="mt-6 pt-6 border-t-2 border-destructive/30">
                      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                        </svg>
                        AI Focus Areas (Heatmap)
                      </h3>
                      
                      {loadingGradcam ? (
                        <div className="flex items-center justify-center p-8 bg-card/50 rounded-xl border border-destructive/20">
                          <Loader size={24} className="text-destructive animate-spin mr-3" />
                          <span className="text-foreground/70">Generating detailed analysis map...</span>
                        </div>
                      ) : result.gradcamImage ? (
                        <div className="space-y-4">
                          <div className="bg-linear-to-br from-card/90 to-card/70 border-2 border-destructive/30 rounded-xl p-4 shadow-lg">
                            <img 
                              src={result.gradcamImage} 
                              alt="AI Analysis Heatmap" 
                              className="w-full rounded-lg shadow-md"
                            />
                            <div className="mt-4 p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                              <p className="text-sm font-semibold text-foreground/90 mb-2">🔍 How to read this heatmap:</p>
                              <ul className="text-xs text-foreground/80 space-y-1.5 ml-4">
                                <li className="flex items-start gap-2">
                                  <span className="text-red-500 font-bold">●</span>
                                  <span><strong className="text-red-500">Red/Hot areas:</strong> Regions where AI detected strongest manipulation signals</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-yellow-500 font-bold">●</span>
                                  <span><strong className="text-yellow-500">Yellow areas:</strong> Moderate suspicious patterns detected</span>
                                </li>
                                <li className="flex items-start gap-2">
                                  <span className="text-blue-500 font-bold">●</span>
                                  <span><strong className="text-blue-500">Blue/Cool areas:</strong> Less significant for the prediction</span>
                                </li>
                              </ul>
                              <p className="text-xs text-foreground/70 mt-3 italic">
                                The AI model focused on highlighted regions when determining this is a deepfake. 
                                Hot spots indicate facial features or areas with synthetic characteristics.
                              </p>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                              <div className="text-xs font-bold text-foreground/70 mb-1">Primary Focus</div>
                              <div className="text-sm text-foreground/90">Facial features & boundaries</div>
                            </div>
                            <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg">
                              <div className="text-xs font-bold text-foreground/70 mb-1">Detection Method</div>
                              <div className="text-sm text-foreground/90">Grad-CAM visualization</div>
                            </div>
                          </div>
                        </div>
                      ) : null}
                    </div>
                  )}

                  {/* Explanation Section */}
                  {result.explanation && (
                    <div className="mt-6 pt-6 border-t-2 border-foreground/20">
                      <h3 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Detailed Analysis Report
                      </h3>
                      
                      {/* Summary */}
                      <div className="mb-5 p-5 rounded-xl bg-linear-to-br from-card/90 to-card/70 border-2 border-foreground/20 shadow-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-bold text-foreground/80 uppercase tracking-wide">Summary</h4>
                          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${
                            result.explanation.confidence_level === 'Very High' ? 'bg-primary/30 text-primary border border-primary/50' :
                            result.explanation.confidence_level === 'High' ? 'bg-blue-500/30 text-blue-600 border border-blue-500/50' :
                            result.explanation.confidence_level === 'Moderate' ? 'bg-yellow-500/30 text-yellow-600 border border-yellow-500/50' :
                            'bg-orange-500/30 text-orange-600 border border-orange-500/50'
                          }`}>
                            {result.explanation.confidence_level} Confidence
                          </span>
                        </div>
                        <p className="text-base text-foreground/90 leading-relaxed font-medium">
                          {result.explanation.summary}
                        </p>
                      </div>

                      {/* Key Indicators */}
                      {result.explanation.indicators && result.explanation.indicators.length > 0 && (
                        <div className="mb-5">
                          <h4 className="text-sm font-bold text-foreground/80 mb-3 uppercase tracking-wide flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                            </svg>
                            Key Findings
                          </h4>
                          <div className="space-y-3">
                            {result.explanation.indicators.map((indicator, index) => (
                              <div 
                                key={index} 
                                className={`flex items-start gap-3 p-4 rounded-lg ${
                                  indicator.includes('⚠️') || indicator.includes('WARNING') 
                                    ? 'bg-orange-500/10 border border-orange-500/30' 
                                    : indicator.includes('ℹ️') || indicator.includes('Note')
                                    ? 'bg-blue-500/10 border border-blue-500/30'
                                    : result.isDeepfake 
                                    ? 'bg-destructive/10 border border-destructive/30' 
                                    : 'bg-green-500/10 border border-green-500/30'
                                }`}
                              >
                                <span className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                                  indicator.includes('⚠️') || indicator.includes('WARNING')
                                    ? 'bg-orange-500 shadow-[0_0_6px_rgba(249,115,22,0.8)]'
                                    : indicator.includes('ℹ️') || indicator.includes('Note')
                                    ? 'bg-blue-500 shadow-[0_0_6px_rgba(59,130,246,0.8)]'
                                    : result.isDeepfake 
                                    ? 'bg-destructive shadow-[0_0_6px_rgba(239,68,68,0.8)]' 
                                    : 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.8)]'
                                }`} />
                                <span className="text-sm text-foreground/90 leading-relaxed flex-1 font-medium">{indicator}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Technical Details (Expandable) */}
                      {result.explanation.technical_details && result.explanation.technical_details.length > 0 && (
                        <details className="group bg-card/50 border border-foreground/20 rounded-lg overflow-hidden">
                          <summary className="cursor-pointer p-4 font-semibold text-foreground hover:bg-card/70 transition flex items-center gap-2">
                            <svg
                              className="w-4 h-4 transition-transform group-open:rotate-90 text-primary"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                            <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                            </svg>
                            Technical Details
                          </summary>
                          <div className="px-4 pb-4 pt-2 bg-black/20">
                            <ul className="space-y-2">
                              {result.explanation.technical_details.map((detail, index) => (
                                <li key={index} className="flex items-start gap-2 text-sm text-foreground/70">
                                  <span className="text-primary mt-1">▸</span>
                                  <span className="font-mono">{detail}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </details>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
