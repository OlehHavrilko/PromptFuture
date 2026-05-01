import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Play, Save, RefreshCw, Sparkles, 
  Terminal, ShieldCheck, Zap, Code2,
  Trash2, Copy, Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { forgePromptStream } from '@/services/gemini';
import { cn } from '@/lib/utils';

export default function PromptPlayground() {
  const [systemPrompt, setSystemPrompt] = useState('Act as a creative copywriter...');
  const [userInput, setUserInput] = useState('Write an ad for a coffee machine');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [history, setHistory] = useState<{role: string, content: string}[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleTest = async () => {
    if (!systemPrompt || !userInput) return;
    setIsGenerating(true);
    setResult('');
    try {
      // We'll hijack forgePromptStream slightly or just simulate it here
      // For a playground, we really want to pass the raw system prompt
      // For now, let's just use the existing service and prepend our system prompt
      const stream = forgePromptStream(`${systemPrompt}\n\nUSER REQUEST: ${userInput}`);
      for await (const chunk of stream) {
        setResult(prev => prev + chunk);
      }
      setHistory(prev => [{ role: 'user', content: userInput }, { role: 'assistant', content: result }, ...prev]);
    } catch (e) {
      toast.error("Playground nodes saturated. Retry.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={cn(
      "flex flex-col p-4 md:p-10 atmosphere",
      isMobile ? "min-h-screen overflow-y-auto pb-24" : "h-screen overflow-hidden"
    )}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/20 mb-2">
            <Terminal className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Playground</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">Logic Sandbox</h2>
        </div>
        
        <div className="flex items-center gap-3">
           <Button variant="ghost" className="hidden md:flex h-10 rounded-xl bg-white/5 text-white/40 hover:text-white">
              <Save className="w-4 h-4" />
              Save Environment
           </Button>
           <Button onClick={handleTest} disabled={isGenerating} className="mac-button-primary h-12 md:h-10 px-8 w-full md:w-auto">
              {isGenerating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              RUN EXPERIMENT
           </Button>
        </div>
      </div>

      <div className={cn(
        "flex-1 grid gap-6 md:gap-10",
        isMobile ? "grid-cols-1" : "grid-cols-2 overflow-hidden"
      )}>
        {/* Left: Configuration */}
        <div className={cn("flex flex-col gap-6", !isMobile && "overflow-hidden")}>
           <div className="glass-card flex-1 flex flex-col p-0 border-white/10 bg-white/[0.01] min-h-[200px]">
              <div className="px-6 py-3 border-b border-white/5 flex items-center justify-between bg-white/5">
                 <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">System Instructions</span>
                 <Badge variant="outline" className="text-[8px] bg-blue-500/10 border-blue-500/20 text-blue-400">READ-WRITE</Badge>
              </div>
              <Textarea 
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter system role and constraints..."
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm font-mono leading-relaxed p-6 resize-none text-white/60"
              />
           </div>

           <div className="glass-card h-40 flex flex-col p-0 border-white/10 bg-white/[0.01]">
              <div className="px-6 py-3 border-b border-white/5 flex items-center bg-white/5">
                 <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">User Input</span>
              </div>
              <Textarea 
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="What should the AI respond to?"
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm p-6 resize-none text-white/80"
              />
           </div>
        </div>

        {/* Right: Output & History */}
        <div className={cn("flex flex-col gap-6", !isMobile && "overflow-hidden")}>
           <div className="glass-card flex-1 flex flex-col p-0 border-blue-500/10 bg-blue-500/[0.01] min-h-[200px]">
              <div className="px-6 py-3 border-b border-blue-500/10 flex items-center justify-between bg-blue-500/5">
                 <span className="text-[9px] font-black text-blue-400/60 uppercase tracking-widest">Neural Response</span>
                 {isGenerating && <Sparkles className="w-3 h-3 text-blue-400 animate-pulse" />}
              </div>
              <ScrollArea className="flex-1 p-6">
                 <div className="prose prose-invert prose-sm max-w-none text-white/80 whitespace-pre-wrap leading-relaxed">
                    {result || <span className="text-white/10 italic">Waiting for stimulus...</span>}
                 </div>
              </ScrollArea>
           </div>

           <div className="glass-card h-40 flex flex-col p-4 border-white/5 bg-white/[0.01] overflow-hidden">
              <span className="text-[9px] font-black text-white/10 uppercase tracking-widest mb-4 block">Session History</span>
              <ScrollArea className="flex-1">
                 <div className="space-y-2">
                    {history.map((h, i) => (
                      <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-white/5 border border-white/5 group">
                        <span className="text-[10px] text-white/40 truncate flex-1">{h.content}</span>
                        <Button variant="ghost" size="sm" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity">
                           <Trash2 className="w-3 h-3 text-white/20" />
                        </Button>
                      </div>
                    ))}
                    {history.length === 0 && <p className="text-[10px] text-white/5 italic text-center py-4">No cycles recorded yet.</p>}
                 </div>
              </ScrollArea>
           </div>
        </div>
      </div>
    </div>
  );
}
