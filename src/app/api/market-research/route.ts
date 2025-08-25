import { z } from 'zod'
import { withStreaming } from '@/lib/streaming'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { webSearchWithFallback } from '@/lib/search'
import { runLLM } from '@/lib/llm'
import { consume } from '@/lib/rateLimit'
import { addCitation, addChunk, createRun } from '@/lib/market/persistence'

const BodySchema = z.object({ query: z.string().min(1) })

export async function POST(req: Request) {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  const userId = user?.id || 'anon'

  const allowed = await consume(`market:${userId}`)
  if (!allowed) return new Response('Rate limit exceeded', { status: 429 })

  const body = BodySchema.safeParse(await req.json())
  if (!body.success) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), {
      status: 400,
    })
  }

  return withStreaming(async (stream) => {
    const runId = await createRun(supabase, userId, body.data.query)
    stream.sendMessage('planning_start', { runId })

    const results = await webSearchWithFallback(body.data.query, `web:${userId}`)
    for (const r of results) {
      await addCitation(supabase, runId, r)
      stream.sendMessage('step_progress', { citation: r })
    }

    const context = results
      .map((r) => `${r.title}: ${r.snippet}`)
      .join('\n\n')

    const analysis = await runLLM({
      provider: 'groq',
      system: 'You are a helpful market research analyst. Use the given sources.',
      user: `${body.data.query}\n\n${context}`,
    })

    await addChunk(supabase, runId, analysis)
    stream.sendMessage('mission_complete', { analysis })
  })
}
