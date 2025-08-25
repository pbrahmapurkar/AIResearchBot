export async function callAnthropic({ system = '', user }: { system?: string; user: string }): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) throw new Error('ANTHROPIC_API_KEY missing')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'x-api-key': key,
      'anthropic-version': '2023-06-01',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'claude-3-haiku-20240307',
      max_tokens: 512,
      system,
      messages: [{ role: 'user', content: user }]
    })
  })

  const data = await res.json()
  if (!res.ok) {
    throw new Error(`Anthropic API error: ${res.status} ${data.error?.message || 'Unknown error'}`)
  }

  return data?.content?.[0]?.text ?? JSON.stringify(data)
}
