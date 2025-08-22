export async function callCohere({ system = '', user }: { system?: string; user: string }): Promise<string> {
  const key = process.env.COHERE_API_KEY
  if (!key) throw new Error('COHERE_API_KEY missing')
  
  const res = await fetch('https://api.cohere.com/v1/chat', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${key}` 
    },
    body: JSON.stringify({
      model: 'command-r-plus',
      temperature: 0.2,
      max_tokens: 2048,
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        { role: 'user', content: user },
      ],
    })
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(`Cohere API error: ${res.status} ${data.message || 'Unknown error'}`)
  }
  
  // Cohere may return in different fields across versions:
  const content = data?.text || data?.message?.content?.[0]?.text
  if (!content) {
    throw new Error(`Cohere returned no content: ${JSON.stringify(data)}`)
  }
  
  return content
}
