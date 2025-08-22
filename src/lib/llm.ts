import OpenAI from 'openai'

export interface PlanOutput {
  steps: Array<{
    title: string
    objective: string
    toolsRequired: string[]
  }>
  estimatedDuration: number
}

export interface StepOutput {
  content: string
  confidence: number
  toolsUsed: string[]
  sources?: Array<{
    title: string
    url: string
    snippet: string
  }>
}

export interface ReviewScore {
  confidence: number
  needsRetry: boolean
  feedback: string
}

class LLMService {
  private client: OpenAI | null = null

  private getClient(): OpenAI {
    if (!this.client) {
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        throw new Error('OPENAI_API_KEY environment variable is required')
      }
      
      this.client = new OpenAI({
        apiKey,
        baseURL: process.env.OPENAI_BASE_URL || undefined,
      })
    }
    return this.client
  }

  async plan(mission: string): Promise<PlanOutput> {
    const prompt = `
You are an AI mission planner. Break down this mission into 3-8 atomic, executable steps.
Each step should be specific and achievable with available tools (web search, content fetch, analysis).

Mission: ${mission}

Respond with JSON in this format:
{
  "steps": [
    {
      "title": "Clear, actionable step title",
      "objective": "Specific goal and expected outcome",
      "toolsRequired": ["searchWeb", "fetchContent", "writeArtifact"]
    }
  ],
  "estimatedDuration": 300
}

Make steps logical and sequential. Focus on research, analysis, and synthesis.
`

    const response = await this.getClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from LLM')
    }

    try {
      return JSON.parse(content) as PlanOutput
    } catch (error) {
      throw new Error(`Failed to parse LLM response: ${error}`)
    }
  }

  async execute(objective: string, context: string[], availableTools: string[]): Promise<StepOutput> {
    const prompt = `
You are executing a step in a mission. Use the available tools to achieve the objective.

Objective: ${objective}
Available Tools: ${availableTools.join(', ')}
Context from previous steps: ${context.join('\n')}

Provide a detailed execution plan and expected outcome. If you need to search for information, be specific about search queries. If you need to fetch content, identify the most relevant URLs.

Respond with JSON:
{
  "content": "Detailed execution plan or actual content if this is a synthesis step",
  "confidence": 0.9,
  "toolsUsed": ["searchWeb", "fetchContent"],
  "sources": [
    {"title": "Source Title", "url": "https://...", "snippet": "Relevant excerpt"}
  ]
}
`

    const response = await this.getClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from LLM')
    }

    try {
      return JSON.parse(content) as StepOutput
    } catch (error) {
      throw new Error(`Failed to parse LLM response: ${error}`)
    }
  }

  async review(stepOutput: string, originalObjective: string): Promise<ReviewScore> {
    const prompt = `
Review this step output against the original objective. Assess quality and completeness.

Original Objective: ${originalObjective}
Step Output: ${stepOutput}

Rate the output and determine if it needs to be retried.

Respond with JSON:
{
  "confidence": 0.85,
  "needsRetry": false,
  "feedback": "Detailed assessment of quality and completeness"
}
`

    const response = await this.getClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      response_format: { type: 'json_object' }
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from LLM')
    }

    try {
      return JSON.parse(content) as ReviewScore
    } catch (error) {
      throw new Error(`Failed to parse LLM response: ${error}`)
    }
  }

  async synthesize(artifacts: Array<{ title: string; content: string; type: string }>): Promise<string> {
    const prompt = `
Create a comprehensive final report synthesizing these artifacts into a cohesive deliverable.

Artifacts:
${artifacts.map(a => `${a.title} (${a.type}):\n${a.content}`).join('\n\n')}

Create a well-structured report with:
1. Executive summary
2. Key findings
3. Detailed analysis
4. Conclusions and recommendations
5. Sources and citations

Use markdown formatting for the final report.
`

    const response = await this.getClient().chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
    })

    const content = response.choices[0]?.message?.content
    if (!content) {
      throw new Error('No response from LLM')
    }

    return content
  }
}

export const llmService = new LLMService()
