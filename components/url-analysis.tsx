"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Link2, Loader2, CheckCircle, XCircle, AlertTriangle } from "lucide-react"

export default function URLAnalysis() {
  const [url, setUrl] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [thumbnail, setThumbnail] = useState<string | null>(null)

  const analyzeURL = async () => {
    if (!url) return

    setIsAnalyzing(true)
    setResult(null)
    setError(null)
    setThumbnail(null)

    try {
      // Download image from URL
      const response = await fetch(url)
      const blob = await response.blob()
      
      // Create thumbnail
      const reader = new FileReader()
      reader.onload = (e) => setThumbnail(e.target?.result as string)
      reader.readAsDataURL(blob)

      // Send to backend
      const formData = new FormData()
      formData.append('file', blob, 'image.jpg')

      const apiResponse = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      })

      const data = await apiResponse.json()

      if (!apiResponse.ok) {
        throw new Error(data.error || 'Failed to analyze image')
      }

      setResult({
        isDeepfake: data.label === 'FAKE',
        confidence: data.confidence,
        processingTime: data.processing_time,
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze URL')
    } finally {
      setIsAnalyzing(false)
    }
  }

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-background to-muted/30">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Link2 className="text-primary" size={32} />
            <h2 className="text-3xl sm:text-4xl font-bold">🔗 Analyze from URL</h2>
          </div>
          <p className="text-lg text-muted-foreground">
            Paste an image URL from Instagram, Facebook, Twitter, or any website
          </p>
        </div>

        <div className="bg-card rounded-2xl border-2 border-border p-6 shadow-lg">
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="flex-1 px-4 py-3 rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
              onKeyDown={(e) => e.key === 'Enter' && analyzeURL()}
            />
            <Button
              onClick={analyzeURL}
              disabled={!url || isAnalyzing}
              className="px-6"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={16} />
                  Analyzing
                </>
              ) : (
                <>
                  <Link2 className="mr-2" size={16} />
                  Analyze
                </>
              )}
            </Button>
          </div>

          <div className="text-xs text-muted-foreground">
            💡 Tip: Right-click any image → Copy Image Address → Paste here
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-100 dark:bg-red-950 border border-red-300 rounded-lg">
              <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
                <AlertTriangle size={20} />
                <span className="font-medium">{error}</span>
              </div>
            </div>
          )}

          {thumbnail && (
            <div className="mt-6">
              <img
                src={thumbnail}
                alt="Analyzed"
                className="w-full max-h-96 object-contain rounded-lg border-2 border-border"
              />
            </div>
          )}

          {result && (
            <div
              className={`mt-6 p-6 rounded-xl border-2 ${
                result.isDeepfake
                  ? 'bg-red-50 dark:bg-red-950 border-red-300'
                  : 'bg-green-50 dark:bg-green-950 border-green-300'
              }`}
            >
              <div className="flex items-center gap-4 mb-4">
                {result.isDeepfake ? (
                  <XCircle className="text-red-600" size={40} />
                ) : (
                  <CheckCircle className="text-green-600" size={40} />
                )}
                <div>
                  <h3 className="text-2xl font-bold">
                    {result.isDeepfake ? 'Deepfake Detected!' : 'Authentic Image'}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {result.confidence.toFixed(1)}% confidence
                  </p>
                </div>
              </div>

              <div className="h-3 bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-1000 ${
                    result.isDeepfake ? 'bg-red-600' : 'bg-green-600'
                  }`}
                  style={{ width: `${result.confidence}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
