// Test script to demonstrate LLM auto-routing
const { autoSelectProvider } = require('./src/lib/llm/index.ts')

console.log('🤖 LLM Auto-Routing Test\n')

const testCases = [
  {
    mission: "Create a quick draft plan for a team lunch",
    expected: "Cost-sensitive → Mistral"
  },
  {
    mission: "Develop a comprehensive enterprise strategy roadmap for digital transformation with detailed requirements analysis and trade-offs evaluation",
    expected: "Complex reasoning → Cohere"
  },
  {
    mission: "Compare and benchmark the top 5 AI testing tools in the market, research their features, collect pricing information, and summarize findings with sources",
    expected: "Research/synthesis → Gemini"
  },
  {
    mission: "Generate a JSON schema for our API endpoints with proper validation steps",
    expected: "Structured output → Gemini"
  },
  {
    mission: "Plan a product launch",
    expected: "Default → OpenAI (if key present) or Gemini"
  }
]

testCases.forEach((testCase, index) => {
  console.log(`Test ${index + 1}: ${testCase.expected}`)
  console.log(`Mission: "${testCase.mission}"`)
  
  try {
    const provider = autoSelectProvider(testCase.mission)
    console.log(`Selected: ${provider}`)
  } catch (error) {
    console.log(`Error: ${error.message}`)
  }
  
  console.log('---')
})

console.log('\n🌟 Environment Variables for Full Testing:')
console.log('LLM_PROVIDER=auto (default) | openai | gemini | cohere | mistral')
console.log('OPENAI_API_KEY=your_openai_key')
console.log('GEMINI_API_KEY=your_gemini_key') 
console.log('COHERE_API_KEY=your_cohere_key')
console.log('HF_API_KEY=your_huggingface_key')
console.log('HF_MISTRAL_MODEL=mistralai/Mistral-7B-Instruct-v0.1 (optional)')
