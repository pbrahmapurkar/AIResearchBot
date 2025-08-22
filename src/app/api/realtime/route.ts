import { NextRequest } from 'next/server'

// SSE endpoint for real-time alerts
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const languages = url.searchParams.get('languages')?.split(',') || ['hi', 'ta', 'te', 'mr']
  
  const encoder = new TextEncoder()
  
  const stream = new ReadableStream({
    start(controller) {
      // Send initial connection message
      const initialData = JSON.stringify({
        type: 'connection',
        message: 'Connected to Mister PB real-time alerts',
        timestamp: Date.now()
      })
      controller.enqueue(encoder.encode(`data: ${initialData}\n\n`))

      // Simulate real-time alerts
      const alertInterval = setInterval(() => {
        const alertTypes = ['trend', 'crisis', 'price', 'festival']
        const regions = ['maharashtra_tier2', 'tamilnadu_tier2', 'andhra_pradesh_tier2', 'uttar_pradesh_tier2']
        const severities = ['low', 'medium', 'high']
        
        // Generate contextual messages
        let message = ''
        const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)]
        const regionId = regions[Math.floor(Math.random() * regions.length)]
        
        const randomAlert = {
          id: `alert_${Date.now()}`,
          type: alertType,
          regionId,
          lang: languages[Math.floor(Math.random() * languages.length)],
          severity: severities[Math.floor(Math.random() * severities.length)],
          timestamp: Date.now(),
          message: '' // Initialize message property
        }
        switch (randomAlert.type) {
          case 'trend':
            message = `🔥 Trending: New discussion pattern detected in ${randomAlert.regionId.replace(/_/g, ' ')}`
            break
          case 'crisis':
            message = `⚠️ Alert: Negative sentiment spike in ${randomAlert.regionId.replace(/_/g, ' ')}`
            break
          case 'price':
            message = `💰 Price Watch: High price sensitivity detected in ${randomAlert.regionId.replace(/_/g, ' ')}`
            break
          case 'festival':
            message = `🎉 Festival Prep: Increased activity ahead of upcoming festival in ${randomAlert.regionId.replace(/_/g, ' ')}`
            break
        }

        randomAlert.message = message

        const data = JSON.stringify(randomAlert)
        controller.enqueue(encoder.encode(`data: ${data}\n\n`))
      }, 10000) // Send alert every 10 seconds

      // Cleanup on close
      request.signal?.addEventListener('abort', () => {
        clearInterval(alertInterval)
        controller.close()
      })

      // Auto-close after 5 minutes to prevent memory leaks
      setTimeout(() => {
        clearInterval(alertInterval)
        controller.close()
      }, 300000)
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  })
}
