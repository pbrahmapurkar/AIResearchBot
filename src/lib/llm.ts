import OpenAI from "openai";
import {
  LlmError, PlanOutputSchema, StepOutputSchema, ReviewScoreSchema,
  type PlanOutput, type StepOutput, type ReviewScore,
} from "./llm.type";
import { PLAN_SYS, PLAN_USER, EXECUTE_SYS, EXECUTE_USER, REVIEW_SYS, REVIEW_USER, SYNTH_SYS, SYNTH_USER } from "./prompts/llm";

const LLM_MODEL = process.env.LLM_MODEL || "gpt-4o-mini";
const LLM_BASE_URL = process.env.OPENAI_BASE_URL || undefined;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const withTimeout = async <T>(p: Promise<T>, ms = 45_000): Promise<T> =>
  Promise.race([
    p,
    new Promise<never>((_, rej) => setTimeout(() => rej(new LlmError(`LLM request timed out after ${ms}ms`)), ms)),
  ]);

const retry = async <T>(fn: () => Promise<T>, attempts = 2): Promise<T> => {
  let last: Error = new Error("Unknown error");
  for (let i = 0; i < attempts; i++) {
    try { 
      return await fn(); 
    } catch (e: unknown) {
      last = e instanceof Error ? e : new Error(String(e));
      const m = (last.message || "").toLowerCase();
      const transient = m.includes("rate") || m.includes("429") || m.includes("overloaded") || m.includes("timeout") || m.startsWith("5");
      if (!transient || i === attempts - 1) break;
      await new Promise(r => setTimeout(r, 400 * (i + 1) + Math.random()*150));
    }
  }
  throw last;
};

const extractJson = (s: string) => s.match(/\{[\s\S]*\}$/)?.[0] ?? s;

const mkClient = () => {
  if (!OPENAI_API_KEY) throw new LlmError("OPENAI_API_KEY environment variable is required");
  return new OpenAI({ apiKey: OPENAI_API_KEY, baseURL: LLM_BASE_URL });
};

class LLMService {
  private client: OpenAI | null = null;
  private getClient() { return (this.client ??= mkClient()); }

  async plan(mission: string): Promise<PlanOutput> {
    const run = async (): Promise<PlanOutput> => {
      const res = await withTimeout(this.getClient().chat.completions.create({
        model: LLM_MODEL, temperature: 0.1, response_format: { type: "json_object" },
        messages: [{ role: "system", content: PLAN_SYS }, { role: "user", content: PLAN_USER(mission) }],
      }));
      const raw = extractJson(res.choices[0]?.message?.content ?? "");
      const parsed = JSON.parse(raw);
      return PlanOutputSchema.parse(parsed);
    };
    return retry(run);
  }

  async execute(objective: string, context: string[], availableTools: string[]): Promise<StepOutput> {
    const run = async (): Promise<StepOutput> => {
      const res = await withTimeout(this.getClient().chat.completions.create({
        model: LLM_MODEL, temperature: 0.2, response_format: { type: "json_object" },
        messages: [{ role: "system", content: EXECUTE_SYS }, { role: "user", content: EXECUTE_USER(objective, context, availableTools) }],
      }));
      const raw = extractJson(res.choices[0]?.message?.content ?? "");
      const data = JSON.parse(raw);
      if (Array.isArray(data?.toolsUsed)) {
        data.toolsUsed = data.toolsUsed.filter((t: string) => ["searchWeb","fetchContent","writeArtifact","analyze"].includes(t));
      }
      return StepOutputSchema.parse(data);
    };
    return retry(run);
  }

  async review(stepOutput: string, originalObjective: string): Promise<ReviewScore> {
    const run = async (): Promise<ReviewScore> => {
      const res = await withTimeout(this.getClient().chat.completions.create({
        model: LLM_MODEL, temperature: 0.1, response_format: { type: "json_object" },
        messages: [{ role: "system", content: REVIEW_SYS }, { role: "user", content: REVIEW_USER(stepOutput, originalObjective) }],
      }));
      const raw = extractJson(res.choices[0]?.message?.content ?? "");
      const parsed = JSON.parse(raw);
      return ReviewScoreSchema.parse(parsed);
    };
    return retry(run);
  }

  async synthesize(artifacts: Array<{ title: string; content: string; type: string }>): Promise<string> {
    const res = await withTimeout(this.getClient().chat.completions.create({
      model: LLM_MODEL, temperature: 0.3,
      messages: [{ role: "system", content: SYNTH_SYS }, { role: "user", content: SYNTH_USER(artifacts) }],
    }));
    const content = res.choices[0]?.message?.content;
    if (!content) throw new LlmError("LLM returned empty content (synthesize)");
    return content;
  }
}

export const llmService = new LLMService();
