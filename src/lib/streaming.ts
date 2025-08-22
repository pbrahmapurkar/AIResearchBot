// lib/streaming.ts

export type StreamEventType =
  | 'planning_start'
  | 'planning_complete'
  | 'step_start'
  | 'step_progress'
  | 'step_complete'
  | 'step_error'
  | 'mission_complete'
  | 'mission_error'

export interface StreamEvent {
  type: StreamEventType
  data: Record<string, unknown>
  timestamp: number
}

export class StreamingResponse {
  private controller: ReadableStreamDefaultController<Uint8Array>
  private encoder = new TextEncoder()

  constructor(controller: ReadableStreamDefaultController<Uint8Array>) {
    this.controller = controller
  }

  /** SSE event with native `event:` line + JSON payload in `data:` */
  sendEvent(event: StreamEvent) {
    const payload = [
      `event: ${event.type}`,
      `data: ${JSON.stringify(event)}`,
      '', // blank line terminator
    ].join('\n')
    this.controller.enqueue(this.encoder.encode(payload))
  }

  sendMessage(type: StreamEventType, data: Record<string, unknown>) {
    this.sendEvent({
      type,
      data,
      timestamp: Date.now(),
    })
  }

  /** Optional plain SSE message without a typed event name */
  sendRaw(name: string, data: unknown) {
    const payload = [`event: ${name}`, `data: ${JSON.stringify(data)}`, ''].join('\n')
    this.controller.enqueue(this.encoder.encode(payload))
  }

  close() {
    this.controller.close()
  }

  error(error: unknown) {
    const err = error instanceof Error ? error : new Error('Unknown error')
    this.sendMessage('mission_error', {
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    })
    this.close()
  }
}

/**
 * Wrap a handler that writes SSE to the client.
 * Sends an initial `connected` event before invoking your handler.
 */
export function withStreaming(
  handler: (stream: StreamingResponse) => Promise<void>
): Response {
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const encoder = new TextEncoder()
      // Initial "connected" ping (no dependency on `this`)
      controller.enqueue(
        encoder.encode('event: connected\ndata: {"status":"connected"}\n\n')
      )

      const sse = new StreamingResponse(controller)
      try {
        await handler(sse)
        sse.close()
      } catch (err) {
        // Also log on the server for debugging
        console.error('Streaming error:', err)
        sse.error(err)
      }
    },
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      // CORS (relax or tighten as needed)
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
