import { z } from "zod";

export const ToolName = z.enum(["searchWeb","fetchContent","writeArtifact","analyze"]);
export type ToolName = z.infer<typeof ToolName>;

export const PlanStep = z.object({
  title: z.string().min(3),
  objective: z.string().min(5),
  toolsRequired: z.array(ToolName).min(1),
});
export const PlanOutputSchema = z.object({
  steps: z.array(PlanStep).min(1),
  estimatedDuration: z.number().int().positive(),
});
export type PlanOutput = z.infer<typeof PlanOutputSchema>;

export const SourceSchema = z.object({
  title: z.string().min(1),
  url: z.string().url(),
  snippet: z.string().min(1),
});
export const StepOutputSchema = z.object({
  content: z.string().min(1),
  confidence: z.number().min(0).max(1),
  toolsUsed: z.array(ToolName).min(0),
  sources: z.array(SourceSchema).optional(),
});
export type StepOutput = z.infer<typeof StepOutputSchema>;

export const ReviewScoreSchema = z.object({
  confidence: z.number().min(0).max(1),
  needsRetry: z.boolean(),
  feedback: z.string().min(1),
});
export type ReviewScore = z.infer<typeof ReviewScoreSchema>;

export class LlmError extends Error {
  constructor(message: string, public cause?: unknown) {
    super(message); this.name = "LlmError";
  }
}
