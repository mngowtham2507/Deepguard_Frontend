"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeftRight, Upload, Loader2, CheckCircle, XCircle } from "lucide-react"

interface ComparisonResult {
  image: string
  isDeepfake: boolean
  confidence: number
  filename: string
}

export default function ComparisonMode() {
  const [leftImage, setLeftImage] = useState<ComparisonResult | null>(null)
  const [rightImage, setRightImage] = useState<ComparisonResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState<{ left: boolean; right: boolean }>({ left: false, right: false })

  const analyzeImage = async (file: File, side: 'left' | 'right') => {
    setIsAnalyzing(prev => ({ ...prev, [side]: true }))

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      const reader = new FileReader()
      reader.onload = (e) => {
        const result: ComparisonResult = {
          image: e.target?.result as string,
          isDeepfake: data.label === 'FAKE',
          confidence: data.confidence,
          filename: file.name,
        }

        if (side === 'left') setLeftImage(result)
        else setRightImage(result)
      }
      reader.readAsDataURL(file)
    } catch (err) {
      console.error('Analysis error:', err)
    } finally {
      setIsAnalyzing(prev => ({ ...prev, [side]: false }))
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'left' | 'right') => {
    const file = e.target.files?.[0]
    if (file) analyzeImage(file, side)
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <ArrowLeftRight className="text-primary" size={36} />
            <h2 className="text-4xl sm:text-5xl font-bold">Side-by-Side Comparison</h2>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Upload two images to compare and see which one is authentic
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Left Image */}
          <div className="space-y-4">
            <div className="relative h-96 rounded-2xl border-2 border-dashed border-primary/30 overflow-hidden bg-card hover:border-primary/60 transition-all">
              {leftImage ? (
                <div className="relative h-full">
                  <img
                    src={leftImage.image}
                    alt="Left comparison"
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-white ${
                    leftImage.isDeepfake ? 'bg-red-500' : 'bg-green-500'
                  }`}>
                    {leftImage.isDeepfake ? (
                      <div className="flex items-center gap-2">
                        <XCircle size={16} />
                        FAKE
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        REAL
                      </div>
                    )}
                  </div>
                </div>
              ) : isAnalyzing.left ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="animate-spin text-primary mb-4" size={48} />
                  <p className="text-muted-foreground">Analyzing...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Upload className="text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground font-medium">Upload Left Image</p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'left')}
              className="hidden"
              id="left-upload"
            />
            <Button
              onClick={() => document.getElementById('left-upload')?.click()}
              className="w-full"
              variant="outline"
              disabled={isAnalyzing.left}
            >
              <Upload className="mr-2" size={16} />
              {leftImage ? 'Change Image' : 'Upload Left Image'}
            </Button>

            {leftImage && (
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <span className="text-xl font-bold">{leftImage.confidence.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      leftImage.isDeepfake ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${leftImage.confidence}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Right Image */}
          <div className="space-y-4">
            <div className="relative h-96 rounded-2xl border-2 border-dashed border-primary/30 overflow-hidden bg-card hover:border-primary/60 transition-all">
              {rightImage ? (
                <div className="relative h-full">
                  <img
                    src={rightImage.image}
                    alt="Right comparison"
                    className="w-full h-full object-cover"
                  />
                  <div className={`absolute top-4 right-4 px-4 py-2 rounded-full font-bold text-white ${
                    rightImage.isDeepfake ? 'bg-red-500' : 'bg-green-500'
                  }`}>
                    {rightImage.isDeepfake ? (
                      <div className="flex items-center gap-2">
                        <XCircle size={16} />
                        FAKE
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <CheckCircle size={16} />
                        REAL
                      </div>
                    )}
                  </div>
                </div>
              ) : isAnalyzing.right ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <Loader2 className="animate-spin text-primary mb-4" size={48} />
                  <p className="text-muted-foreground">Analyzing...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full">
                  <Upload className="text-muted-foreground mb-4" size={48} />
                  <p className="text-muted-foreground font-medium">Upload Right Image</p>
                </div>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'right')}
              className="hidden"
              id="right-upload"
            />
            <Button
              onClick={() => document.getElementById('right-upload')?.click()}
              className="w-full"
              variant="outline"
              disabled={isAnalyzing.right}
            >
              <Upload className="mr-2" size={16} />
              {rightImage ? 'Change Image' : 'Upload Right Image'}
            </Button>

            {rightImage && (
              <div className="p-4 rounded-lg bg-card border border-border">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-muted-foreground">Confidence</span>
                  <span className="text-xl font-bold">{rightImage.confidence.toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-1000 ${
                      rightImage.isDeepfake ? 'bg-red-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${rightImage.confidence}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Comparison Summary */}
        {leftImage && rightImage && (
          <div className="mt-8 p-6 rounded-2xl bg-card border-2 border-primary/30 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 text-center">📊 Comparison Summary</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className={`p-4 rounded-lg text-center ${
                leftImage.isDeepfake ? 'bg-red-100 dark:bg-red-950' : 'bg-green-100 dark:bg-green-950'
              }`}>
                <div className="text-sm text-muted-foreground mb-1">Left Image</div>
                <div className={`text-2xl font-bold ${
                  leftImage.isDeepfake ? 'text-red-600' : 'text-green-600'
                }`}>
                  {leftImage.isDeepfake ? 'DEEPFAKE' : 'AUTHENTIC'}
                </div>
                <div className="text-sm mt-1">{leftImage.confidence.toFixed(1)}% confident</div>
              </div>
              <div className={`p-4 rounded-lg text-center ${
                rightImage.isDeepfake ? 'bg-red-100 dark:bg-red-950' : 'bg-green-100 dark:bg-green-950'
              }`}>
                <div className="text-sm text-muted-foreground mb-1">Right Image</div>
                <div className={`text-2xl font-bold ${
                  rightImage.isDeepfake ? 'text-red-600' : 'text-green-600'
                }`}>
                  {rightImage.isDeepfake ? 'DEEPFAKE' : 'AUTHENTIC'}
                </div>
                <div className="text-sm mt-1">{rightImage.confidence.toFixed(1)}% confident</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
