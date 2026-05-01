import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Settings2, Save, RotateCcw, ShieldCheck, 
  Cpu, Terminal, Zap, Info, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

const DEFAULT_SYSTEM_PROMPT = `You are a world-class prompt engineer with deep expertise in LLM behavior, instruction design, and output optimization. Your sole task is to transform a user's rough idea into a precisely engineered, production-ready prompt.

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

export default function AdminPromptConfig() {
  const [config, setConfig] = useState({
    systemPrompt: localStorage.getItem('admin_system_prompt') || DEFAULT_SYSTEM_PROMPT,
    temperature: localStorage.getItem('admin_temp') || '0.7',
    topP: localStorage.getItem('admin_top_p') || '0.9',
    model: localStorage.getItem('admin_model') || 'gemini-3-flash-preview',
  });

  const handleSave = () => {
    localStorage.setItem('admin_system_prompt', config.systemPrompt);
    localStorage.setItem('admin_temp', config.temperature);
    localStorage.setItem('admin_top_p', config.topP);
    localStorage.setItem('admin_model', config.model);
    toast.success("Neural configuration updated globally");
    window.location.reload(); // Reload to ensure services pick up new config
  };

  const resetToDefault = () => {
    setConfig({
      systemPrompt: DEFAULT_SYSTEM_PROMPT,
      temperature: '0.7',
      topP: '0.9',
      model: 'gemini-3-flash-preview'
    });
    toast.info("Settings reset to factory defaults");
  };

  return (
    <div className="h-screen flex flex-col p-10 atmosphere overflow-hidden">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/20 mb-2">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Core Protocol</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-white">Engine Configuration</h2>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="ghost" onClick={resetToDefault} className="h-10 rounded-xl bg-white/5 text-white/40 hover:text-white">
              <RotateCcw className="w-4 h-4" />
              Reset
           </Button>
           <Button onClick={handleSave} className="mac-button-primary h-10 px-8">
              <Save className="w-4 h-4" />
              COMMIT CHANGES
           </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-10 overflow-hidden">
        {/* Main Editor */}
        <div className="lg:col-span-2 flex flex-col gap-6 overflow-hidden">
           <div className="glass-card flex-1 flex flex-col p-0 border-white/10 bg-white/[0.01]">
              <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between bg-white/5">
                 <div className="flex items-center gap-3">
                    <Terminal className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white/80">Master System Instructions</span>
                 </div>
                 <Badge variant="outline" className="text-[8px] bg-red-500/10 border-red-500/20 text-red-400 font-black uppercase">Critical Path</Badge>
              </div>
              <Textarea 
                value={config.systemPrompt}
                onChange={(e) => setConfig({...config, systemPrompt: e.target.value})}
                placeholder="Define the AI's core behavior, constraints, and output protocols..."
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm font-mono leading-relaxed p-8 resize-none text-white/60"
              />
           </div>
        </div>

        {/* Engine Parameters */}
        <div className="space-y-6 overflow-y-auto pr-2">
           <div className="glass-card p-6 border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-3 mb-6">
                 <Cpu className="w-4 h-4 text-amber-500" />
                 <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Neural Parameters</h3>
              </div>
              
              <div className="space-y-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Model Architecture</label>
                    <select 
                      value={config.model}
                      onChange={(e) => setConfig({...config, model: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl h-12 px-4 text-xs font-bold text-white focus:ring-2 focus:ring-blue-500/20 outline-none"
                    >
                       <option value="gemini-3-flash-preview">Gemini 3 Flash (Performance)</option>
                       <option value="gemini-3.1-pro-preview">Gemini 3.1 Pro (Reasoning)</option>
                       <option value="gemini-2.0-flash">Gemini 2.0 Flash (Legacy)</option>
                       <option value="gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro (Experimental)</option>
                       <option value="gemini-2.0-flash-thinking-exp">Gemini 2.0 Thinking (Reasoning Focus)</option>
                    </select>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Temperature</label>
                       <span className="text-xs font-mono text-amber-500 font-bold">{config.temperature}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05" 
                      value={config.temperature}
                      onChange={(e) => setConfig({...config, temperature: e.target.value})}
                      className="w-full accent-amber-500 bg-white/5 h-2 rounded-full appearance-none transition-all hover:scale-[1.02]"
                    />
                    <div className="flex justify-between text-[8px] font-black text-white/10 uppercase tracking-widest mt-1">
                       <span>Deterministic</span>
                       <span>Creative</span>
                    </div>
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between items-center">
                       <label className="text-[10px] font-black text-white/20 uppercase tracking-widest">Top-P (Nucleus)</label>
                       <span className="text-xs font-mono text-blue-500 font-bold">{config.topP}</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="1" 
                      step="0.05" 
                      value={config.topP}
                      onChange={(e) => setConfig({...config, topP: e.target.value})}
                      className="w-full accent-blue-500 bg-white/5 h-2 rounded-full appearance-none transition-all hover:scale-[1.02]"
                    />
                    <div className="flex justify-between text-[8px] font-black text-white/10 uppercase tracking-widest mt-1">
                       <span>Focused</span>
                       <span>Diverse</span>
                    </div>
                 </div>
              </div>
           </div>

           <div className="p-6 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-4">
              <div className="flex items-center gap-2 text-blue-400">
                 <Info className="w-4 h-4" />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Architecture Note</h4>
              </div>
              <p className="text-[10px] text-blue-400/60 leading-relaxed font-medium">
                 These settings directly influence the generation logic used in 
                 <span className="text-blue-400"> Forge</span>, 
                 <span className="text-blue-400"> Chat</span>, and 
                 <span className="text-blue-400"> Vision</span> modules.
              </p>
           </div>

           <div className="p-6 rounded-2xl bg-red-500/5 border border-red-500/10 flex items-start gap-3">
              <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5" />
              <p className="text-[10px] text-red-500/40 leading-relaxed font-medium">
                 Modifying the system prompt requires thorough regression testing in the Neural Playground.
              </p>
           </div>
        </div>
      </div>
    </div>
  );
}
