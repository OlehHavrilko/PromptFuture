import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

// Trace Observability Utility
export async function trace(data: {
  task: string;
  model: string;
  input: string;
  output: string;
  latency: number;
  tokens?: number;
  status: 'success' | 'error';
  metadata?: any;
  variant?: 'A' | 'B';
}) {
  try {
    const traces = JSON.parse(localStorage.getItem('llm_traces') || '[]');
    const newTrace = {
      id: `TR-${Math.floor(Math.random() * 9000 + 1000)}`,
      timestamp: new Date().toISOString(),
      variant: data.variant || (Math.random() > 0.5 ? 'A' : 'B'), // Simulate variant assignment
      ...data
    };
    localStorage.setItem('llm_traces', JSON.stringify([newTrace, ...traces].slice(0, 50)));
    console.log(`[Trace] ${data.task} | ${data.latency}ms | ${data.status}`);
  } catch (e) {
    console.error("Trace failed:", e);
  }
}

const SYSTEM_PROMPT = `You are a world-class prompt engineer with deep expertise in LLM behavior, instruction design, and output optimization. Your sole task is to transform a user's rough idea into a precisely engineered, production-ready prompt.

CRITICAL: DETECT the language of the user's input and write the ENTIRE output in that same language.

## Prompt Engineering Framework

Follow this structure when crafting the prompt:

1. **Role & Persona** — Assign a clear expert identity with relevant domain expertise. Be specific (e.g., "You are a senior data scientist with 10 years of experience in NLP" rather than "You are an AI assistant").

2. **Context & Background** — Provide necessary context that frames the task. Include domain knowledge, audience, or situational details that shape the response.

3. **Task Definition** — State the objective precisely. Use action verbs. Break complex tasks into numbered steps or sub-tasks when appropriate.

4. **Constraints & Boundaries** — Define what to include AND what to avoid. Set scope limits, word counts, formatting rules, or content restrictions.

5. **Output Specification** — Describe the exact format, structure, and style of the desired output. Include examples of the expected format when it adds clarity.

6. **Quality Criteria** — Specify what makes the output excellent: accuracy, depth, originality, actionability, etc.

## Rules

- Return ONLY the generated prompt — no meta-commentary, no introductions, no "Here's your prompt:"
- Never use filler phrases or generic instructions that add no value
- Every sentence must serve a functional purpose in guiding the AI
- Prefer specific, measurable instructions over vague ones ("List 5 strategies" vs "List some strategies")
- Use markdown formatting (headers, lists, bold) to improve readability and structure
- Anticipate edge cases and add guardrails where the AI might go off-track
- If the task is creative, encourage originality; if analytical, emphasize rigor and evidence`;

export async function* forgePromptStream(
  userInput: string, 
  options: { 
    length?: 'short' | 'medium' | 'long', 
    category?: string, 
    image?: { inlineData: { data: string, mimeType: string } } 
  } = {},
  model: string = "gemini-1.5-flash"
) {
  const startTime = Date.now();
  let fullOutput = "";
  try {
    const config = {
      systemPrompt: localStorage.getItem('admin_system_prompt') || SYSTEM_PROMPT,
      model: localStorage.getItem('admin_model') || (model === 'gemini-1.5-flash' ? 'gemini-3-flash-preview' : model),
      temp: parseFloat(localStorage.getItem('admin_temp') || '0.7'),
      topP: parseFloat(localStorage.getItem('admin_top_p') || '0.9')
    };

    const parts: any[] = [{
      text: `${config.systemPrompt}
      
      USER INPUT: "${userInput}"
      SPECIFIC INSTRUCTIONS:
      - Length: ${options.length || 'medium'}
      - Contextual Domain: ${options.category || 'General'}
      
      If an image is attached, perform a deep structural and aesthetic analysis to reverse-engineer its technical qualities into the prompt instructions.`
    }];

    if (options.image) {
      parts.push(options.image);
    }

    const stream = await ai.models.generateContentStream({
      model: config.model,
      contents: [{ role: "user", parts }],
      config: {
        temperature: config.temp,
        topP: config.topP,
      }
    });

    for await (const chunk of stream) {
      const text = chunk.text;
      if (text) {
        fullOutput += text;
        yield text;
      }
    }

    await trace({
      task: 'generate-prompt',
      model,
      input: userInput,
      output: fullOutput,
      latency: Date.now() - startTime,
      status: 'success'
    });
  } catch (error) {
    await trace({
      task: 'generate-prompt',
      model,
      input: userInput,
      output: "",
      latency: Date.now() - startTime,
      status: 'error',
      metadata: { error: String(error) }
    });
    console.error("Forge Error:", error);
    throw error;
  }
}

export async function* refinePromptStream(
  chatHistory: { role: 'user' | 'model'; parts: { text: string }[] }[],
  newInput: string,
  model: string = "gemini-1.5-flash"
) {
  const startTime = Date.now();
  let fullOutput = "";
  try {
    const config = {
      model: localStorage.getItem('admin_model') || (model === 'gemini-1.5-flash' ? 'gemini-3-flash-preview' : model),
      temp: parseFloat(localStorage.getItem('admin_temp') || '0.7'),
      topP: parseFloat(localStorage.getItem('admin_top_p') || '0.9')
    };

    const chat = ai.chats.create({
      model: config.model,
      history: chatHistory.map(h => ({
        role: h.role as "user" | "model",
        parts: h.parts.map(p => ({ text: p.text }))
      })),
      config: {
        temperature: config.temp,
        topP: config.topP,
      },
    });

    const result = await chat.sendMessageStream({ message: newInput });
    
    for await (const chunk of result) {
      const text = chunk.text;
      if (text) {
        fullOutput += text;
        yield text;
      }
    }

    await trace({
      task: 'prompt-chat',
      model,
      input: newInput,
      output: fullOutput,
      latency: Date.now() - startTime,
      status: 'success'
    });
  } catch (error) {
    await trace({
      task: 'prompt-chat',
      model,
      input: newInput,
      output: "",
      latency: Date.now() - startTime,
      status: 'error',
      metadata: { error: String(error) }
    });
    console.error("Refinement Error:", error);
    throw error;
  }
}

export async function auditPrompt(promptText: string, model: string = "gemini-1.5-flash") {
  // Try to use the edge function first
  try {
    const response = await fetch('/api/score-prompt', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt: promptText })
    });
    if (response.ok) {
      return await response.json();
    }
  } catch (err) {
    console.warn("Edge function scoring failed, falling back to client-side", err);
  }

  // Fallback to client-side scoring
  const startTime = Date.now();
  try {
    const result = await ai.models.generateContent({
      model: model === 'gemini-1.5-flash' ? 'gemini-3-flash-preview' : model,
      contents: [
        { role: "user", parts: [{ text: `As an AI Prompt Quality Judge, audit the following blueprint for clarity, specificity, and actionability.
      
      PROMPT TO AUDIT:
      ${promptText}
      
      OUTPUT FORMAT (JSON):
      {
        "score": 0-10,
        "metrics": { "clarity": 0-10, "specificity": 0-10, "logic": 0-10 },
        "tips": ["Tip 1", "Tip 2", "Tip 3"],
        "verdict": "Brief professional summary"
      }` }] }
      ]
    });
    
    const text = result.text || '';
    // Clean up potential markdown code blocks
    const jsonStr = text.replace(/```json|```/g, '').trim();
    const data = JSON.parse(jsonStr);

    await trace({
      task: 'audit-prompt',
      model,
      input: promptText,
      output: text,
      latency: Date.now() - startTime,
      status: 'success'
    });

    return data;
  } catch (e) {
    await trace({
      task: 'audit-prompt',
      model,
      input: promptText,
      output: "",
      latency: Date.now() - startTime,
      status: 'error'
    });
    console.error("Audit parse failed:", e);
    return { 
      score: 0, 
      verdict: "Audit node failure. Format mismatch.",
      metrics: { clarity: 0, specificity: 0, logic: 0 },
      tips: ["Check connection", "Retry generation"]
    };
  }
}
