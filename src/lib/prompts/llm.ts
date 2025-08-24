export const PLAN_SYS = `You are a precise mission planner. Output strict JSON only.`;
export const PLAN_USER = (mission: string) => `
Break the mission into 3–8 atomic steps that a research agent can do
with tools: "searchWeb", "fetchContent", "writeArtifact", "analyze".
Mission: ${mission}
Respond with JSON:
{"steps":[{"title":"...","objective":"...","toolsRequired":["searchWeb"]}],"estimatedDuration":300}
`;

export const EXECUTE_SYS = `You are a rigorous step executor. Output strict JSON only.`;
export const EXECUTE_USER = (objective: string, context: string[], tools: string[]) => `
Objective: ${objective}
Available Tools: ${tools.join(", ")}
Context:
${context.join("\n")}
Return JSON:
{"content":"...","confidence":0.9,"toolsUsed":["searchWeb"],"sources":[{"title":"...","url":"https://...","snippet":"..."}]}
`;

export const REVIEW_SYS = `You are a strict reviewer. Output strict JSON only.`;
export const REVIEW_USER = (stepOutput: string, originalObjective: string) => `
Original Objective: ${originalObjective}
Step Output: ${stepOutput}
Return JSON: {"confidence":0.85,"needsRetry":false,"feedback":"..."}
`;

export const SYNTH_SYS = `You are a senior analyst producing a Markdown report.`;
export const SYNTH_USER = (artifacts: Array<{title:string;content:string;type:string}>) => `
Create a cohesive Markdown report from these artifacts.

Artifacts:
${artifacts.map(a=>`- ${a.title} (${a.type})
${a.content}`).join("\n\n")}

Sections:
1. Executive summary
2. Key findings
3. Detailed analysis
4. Conclusions and recommendations
5. Sources & citations
`;
