export async function callOpenAI({ system = '', user }: { system?: string; user: string }): Promise<string> {
  const key = process.env.OPENAI_API_KEY
  if (!key) throw new Error('OPENAI_API_KEY missing')
  
  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: { 
      'Authorization': `Bearer ${key}`, 
      'Content-Type': 'application/json' 
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 0.2,
      messages: [
        ...(system ? [{ role: 'system', content: system }] : []),
        { role: 'user', content: user }
      ],
    }),
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(`OpenAI API error: ${res.status} ${data.error?.message || 'Unknown error'}`)
  }
  
  return data?.choices?.[0]?.message?.content ?? JSON.stringify(data)
}
