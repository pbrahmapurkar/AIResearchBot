export async function callHF({ system = '', user }: { system?: string; user: string }): Promise<string> {
  const key = process.env.HF_API_KEY
  if (!key) throw new Error('HF_API_KEY missing')
  
  const model = process.env.HF_MISTRAL_MODEL || 'mistralai/Mistral-7B-Instruct-v0.1'
  const prompt = `${system}\n\nUSER:\n${user}\n\nASSISTANT:`
  
  const res = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json', 
      'Authorization': `Bearer ${key}` 
    },
    body: JSON.stringify({
      inputs: prompt,
      parameters: { 
        max_new_tokens: 800, 
        temperature: 0.2, 
        return_full_text: false,
        do_sample: true
      }
    })
  })
  
  const data = await res.json()
  
  if (!res.ok) {
    throw new Error(`HuggingFace API error: ${res.status} ${data.error || 'Unknown error'}`)
  }
  
  // Handle different response formats
  let text = ''
  if (Array.isArray(data)) {
    text = data[0]?.generated_text ?? ''
  } else {
    text = data?.generated_text ?? data?.choices?.[0]?.text ?? ''
  }
  
  if (!text) {
    throw new Error(`HuggingFace returned no content: ${JSON.stringify(data)}`)
  }
  
  return text.trim()
}
