export async function callGemini({ system = '', user }: { system?: string; user: string }): Promise<string> {
  const key = process.env.GEMINI_API_KEY
  if (!key) throw new Error('GEMINI_API_KEY missing')
  
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ 
        role: 'user', 
        parts: [{ text: `${system}\n\nUSER:\n${user}` }] 
      }],
      generationConfig: { 
        temperature: 0.2,
        maxOutputTokens: 2048
      }
    })
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${data.error?.message || 'Unknown error'}`)
  }
  
  const content = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!content) {
    throw new Error(`Gemini returned no content: ${JSON.stringify(data)}`)
  }
  
  return content
}
