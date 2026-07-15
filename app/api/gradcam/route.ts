import { NextResponse } from 'next/server'
import { getBackendBaseUrl } from '@/lib/backend'

export const runtime = 'nodejs'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file')

    if (!(file instanceof File)) {
      return NextResponse.json({ error: 'No image file was provided.' }, { status: 400 })
    }

    const proxyFormData = new FormData()
    proxyFormData.append('file', file, file.name)

    const response = await fetch(`${getBackendBaseUrl()}/gradcam`, {
      method: 'POST',
      body: proxyFormData,
    })

    const contentType = response.headers.get('content-type') || ''

    if (contentType.includes('application/json')) {
      const data = await response.json().catch(() => null)
      return NextResponse.json(data ?? {}, { status: response.status })
    }

    const text = await response.text()
    return new NextResponse(text, {
      status: response.status,
      headers: { 'content-type': contentType || 'text/plain; charset=utf-8' },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : 'Unable to reach the analysis backend.',
      },
      { status: 502 }
    )
  }
}
