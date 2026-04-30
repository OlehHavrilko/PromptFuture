import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  GitCompare, ArrowRight, ChevronLeft, ChevronRight, 
  Check, X, Zap, Terminal, Code2, Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface PromptVersion {
  id: string;
  version: string;
  content: string;
  author: string;
  timestamp: string;
  metrics: { score: number; latency: string };
}

const MOCK_VERSIONS: PromptVersion[] = [
  { 
    id: 'v2', 
    version: '2.1.0', 
    content: 'Act as a Senior Architect. Analyze this codebase for SOLID principles.\n\nCONSTRAINTS:\n1. Focus on Clean Code\n2. Mandatory Markdown\n3. No YAGNI violations', 
    author: 'Oleg H.', 
    timestamp: '2024-03-20',
    metrics: { score: 9.4, latency: '650ms' }
  },
  { 
    id: 'v1', 
    version: '2.0.4', 
    content: 'Review code for SOLID principles.\n\nRULES:\n1. Be concise\n2. Use headings\n3. Check for performance', 
    author: 'System', 
    timestamp: '2024-03-15',
    metrics: { score: 8.2, latency: '820ms' }
  }
];

export default function PromptDiff() {
  const [v1, setV1] = useState(MOCK_VERSIONS[1]);
  const [v2, setV2] = useState(MOCK_VERSIONS[0]);

  return (
    <div className="h-screen flex flex-col p-10 atmosphere overflow-hidden">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/20 mb-2">
            <GitCompare className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Versioning</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-white">Instruction Diff</h2>
        </div>
        
        <div className="flex items-center gap-6 glass p-2 px-6 rounded-3xl border-white/5 bg-white/[0.02]">
           <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-white/10 uppercase tracking-widest mb-1">Source</span>
              <Badge variant="outline" className="bg-white/5 border-white/10 text-white/40">{v1.version}</Badge>
           </div>
           <ArrowRight className="w-4 h-4 text-white/10" />
           <div className="flex flex-col items-center">
              <span className="text-[9px] font-black text-blue-500/40 uppercase tracking-widest mb-1">Candidate</span>
              <Badge variant="outline" className="bg-blue-500/10 border-blue-500/20 text-blue-400">{v2.version}</Badge>
           </div>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 gap-10 overflow-hidden mb-10">
        {/* Left Side: Version A */}
        <div className="glass-card flex flex-col p-0 overflow-hidden border-white/5 bg-white/[0.01]">
           <div className="px-8 py-4 border-b border-white/5 flex items-center justify-between bg-black/20">
              <span className="text-[10px] font-black text-white/30 uppercase tracking-widest">Base: {v1.version}</span>
              <span className="text-[10px] font-mono text-white/10">{v1.author}</span>
           </div>
           <div className="flex-1 p-8 overflow-y-auto font-mono text-xs leading-relaxed text-white/40 whitespace-pre-wrap selection:bg-white/10">
              {v1.content}
           </div>
           <div className="p-6 border-t border-white/5 grid grid-cols-2 gap-4">
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-white/10 uppercase">Quality Score</p>
                 <p className="text-xl font-display font-bold text-white/60">{v1.metrics.score}</p>
              </div>
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-white/10 uppercase">Latency</p>
                 <p className="text-xl font-display font-bold text-white/60">{v1.metrics.latency}</p>
              </div>
           </div>
        </div>

        {/* Right Side: Version B */}
        <div className="glass-card flex flex-col p-0 overflow-hidden border-blue-500/10 bg-blue-500/[0.01]">
           <div className="px-8 py-4 border-b border-blue-500/10 flex items-center justify-between bg-blue-500/5">
              <span className="text-[10px] font-black text-blue-400/60 uppercase tracking-widest">Active: {v2.version}</span>
              <span className="text-[10px] font-mono text-blue-400/20">{v2.author}</span>
           </div>
           <div className="flex-1 p-8 overflow-y-auto font-mono text-xs leading-relaxed text-white/80 whitespace-pre-wrap selection:bg-blue-500/20">
              {/* Diff highlighting simulation - highlighting words that changed */}
              {v2.content.split(' ').map((word, i) => {
                 const isDiff = !v1.content.includes(word);
                 return (
                   <span key={i} className={isDiff ? "bg-blue-500/20 text-blue-100 rounded px-1 -mx-1" : ""}>
                     {word}{' '}
                   </span>
                 );
              })}
           </div>
           <div className="p-6 border-t border-blue-500/10 grid grid-cols-2 gap-4 bg-blue-500/[0.02]">
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-blue-500/40 uppercase">Quality Score</p>
                 <div className="flex items-center gap-2">
                    <p className="text-xl font-display font-bold text-white">{v2.metrics.score}</p>
                    <span className="text-[9px] font-black text-green-500">+{((v2.metrics.score - v1.metrics.score) / v1.metrics.score * 100).toFixed(1)}%</span>
                 </div>
              </div>
              <div className="space-y-1">
                 <p className="text-[9px] font-black text-blue-500/40 uppercase">Latency</p>
                 <div className="flex items-center gap-2">
                    <p className="text-xl font-display font-bold text-white">{v2.metrics.latency}</p>
                    <span className="text-[9px] font-black text-green-500">-20%</span>
                 </div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex items-center justify-center gap-4">
         <Button variant="ghost" className="h-14 px-10 rounded-2xl text-white/20 hover:text-white hover:bg-white/5 font-black text-xs">
            ABORT DEPLOYMENT
         </Button>
         <Button className="mac-button-primary h-14 px-10">
            PROMOTE TO PRODUCTION (V{v2.version})
         </Button>
      </div>
    </div>
  );
}
