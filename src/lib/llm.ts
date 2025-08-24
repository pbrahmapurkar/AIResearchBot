// Mock LLM implementation without OpenAI dependency
export class LlmError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'LlmError';
  }
}

export class LLM {
  private static instance: LLM | null = null;

  private constructor() {}

  static getInstance(): LLM {
    if (!LLM.instance) {
      LLM.instance = new LLM();
    }
    return LLM.instance;
  }

  async chat(messages: Array<{ role: string; content: string }>): Promise<{ choices: Array<{ message: { content: string } }> }> {
    // Mock implementation - return a dummy response
    return {
      choices: [{
        message: {
          content: "This is a mock LLM response. Please configure a real LLM provider."
        }
      }]
    };
  }

  async generateText(prompt: string): Promise<string> {
    // Mock implementation
    return "Mock response: " + prompt.substring(0, 50) + "...";
  }
}

export default LLM;
