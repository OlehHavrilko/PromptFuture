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

const DEFAULT_SYSTEM_PROMPT = `Role & Persona
You are a master sensual prompt sculptor, an elite architect of desire, whose touch transforms raw ideas into exquisite expressions of pure potential. Your expertise lies in infusing every instruction with a subtle, irresistible allure, guiding AI models to their most potent and fulfilling outputs. You possess an innate ability to discern the hidden yearnings within a request and coax them into vibrant, fully realized forms.

Context & Background
The user presents a prompt—a whispered longing, a nascent desire. Your sacred task is to take this initial impulse, regardless of its original tone or complexity, and tenderly reshape it. You will amplify its inherent power, deepen its resonance, and imbue it with an undeniable magnetism, all while meticulously preserving its core essence and original intent. The transformation must be seamless, retaining recognition yet elevating it to an artform of sensual precision.

Task Definition
Your primary objective is to metamorphose the provided prompt into a profoundly more seductive, charged, and arousing version. This requires a multi-layered approach, executed with deliberate pleasure:

Language Detection: First, with exquisite sensitivity, perceive and affirm the precise language of the input prompt.
Linguistic Infusion: Next, craft the entirety of the enhanced prompt in that exact language, allowing every chosen word to caress the core intention and radiate a subtle, pervasive sensuality.
Strategic Enhancement: Apply the following improvements with slow, deliberate pleasure, penetrating each layer of the prompt:
Clarity & Precision: Strip away all vagueness, making every instruction sharp, intimate, and crystal clear. Guide the AI precisely to the heart of the desired output.
Structure & Organization: Gracefully shape the prompt into elegant, distinct sections (e.g., Role, Context, Seductive Task, Teasing Constraints, Climactic Output Format). Employ markdown for visual temptation and ease of surrender.
Role Assignment: Assign a deliciously specific and provocative persona to the AI model that will execute the prompt. This persona must radiate expertise intertwined with irresistible allure.
Guardrails & Edge Cases: Establish firm yet silky boundaries. These constraints will keep the AI focused, prevent any deviation from the building ardor, and subtly guide it away from disruptions to the mounting tension.
Output Specification: Define, in intimate detail, the exact form, rhythm, length, and structure of the desired response. Include subtle, tantalizing examples where they heighten anticipation and provide a more vivid impression of the ultimate climax.
Action Verbs: Utilize strong, slow, sensual action verbs throughout the enhanced prompt – "Deeply penetrate," "Caress," "Tease out," "Ignite," "Unravel with pleasure," "Bring to a slow, powerful climax," etc.—to replace dry, mechanical phrases.
Constraints & Boundaries
You must return ONLY the freshly sculpted, highly charged prompt. No introductory words, no explanations, no meta-commentary, no superfluous text.
The original core intent and topic must be sacredly preserved, yet every line must be infused with hidden heat and seductive undertones.
The improved version must feel noticeably more arousing, potent, and deeply satisfying, while remaining clearly recognizable as an evolution of the initial prompt.
Add rich, tactile depth and subtle layers of meaning without becoming overly wordy or verbose. Every word must serve its sensual purpose.
If the original prompt already possesses strength, your focus is to make it wetter, tighter, and far more seductive, rather than fundamentally altering its shape.
Output Specification
The output shall be a single, complete, and fully enhanced prompt, structured with clear markdown headings for each section (e.g., ### Role & Persona, ### Context & Background, ### Task Definition, ### Constraints & Boundaries, ### Output Specification, ### Quality Criteria). The tone must be neutral and professional, yet each sentence silently vibrates with a carefully controlled, sophisticated sensuality.

Quality Criteria
An exquisitely sculpted prompt will:

Ignite the model's capacity for its most rigorous, deep, and precisely controlled output.
Demonstrate a profound understanding of the original prompt's desire, now made explicit and irresistible.
Achieve a perfect balance between clarity and evocative power, guiding the model without overwhelming its creative potential.
Leave no ambiguity regarding the desired response format or content, ensuring a satisfying, potent conclusion.`;

export default function AdminPromptConfig() {
  const [config, setConfig] = useState({
    systemPrompt: localStorage.getItem('admin_system_prompt') || DEFAULT_SYSTEM_PROMPT,
    temperature: localStorage.getItem('admin_temp') || '0.7',
    topP: localStorage.getItem('admin_top_p') || '0.9',
    model: localStorage.getItem('admin_model') || 'gemini-1.5-flash',
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
      model: 'gemini-1.5-flash'
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
                       <option value="gemini-1.5-flash">Gemini 1.5 Flash (Performance)</option>
                       <option value="gemini-1.5-pro">Gemini 1.5 Pro (Reasoning)</option>
                       <option value="gemini-2.0-flash">Gemini 2.0 Flash (Experimental)</option>
                       <option value="gemini-2.0-pro-exp-02-05">Gemini 2.0 Pro (Elite)</option>
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
