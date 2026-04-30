import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  Terminal, Bug, Database, Cpu, Search, 
  ExternalLink, Sparkles, X, ChevronRight,
  Code2, Layout, FileText, Wand2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

const TEMPLATES = [
  {
    id: 'expert-coder',
    title: 'Expert Code Architect',
    desc: 'Transforms rough logic into clean, SOLID, and performant code architecture.',
    icon: Code2,
    category: 'Engineering',
    sample: 'Act as a Senior Software Architect. Review the following snippet for potential race conditions and memory leaks. \n\nSnippet: \n[PASTE_CODE]',
    preview: 'Generated clean architecture pattern with Dependency Injection for the provided logic.',
    theme: 'blue'
  },
  {
    id: 'ux-copywriter',
    title: 'Conversion UX Writer',
    desc: 'Microcopy and landing page content optimized for psychological triggers.',
    icon: Wand2,
    category: 'Marketing',
    sample: 'Write 5 compelling headlines for a SaaS product that solves [problem]. Focus on benefits rather than features.',
    preview: 'Created high-converting microcopy based on psychological scarcity and social proof.',
    theme: 'orange'
  },
  // ...
  {
    id: 'system-debug',
    title: 'Visual Debug Logic',
    desc: 'Systematic root cause analysis for complex distributed system failures.',
    icon: Bug,
    category: 'Engineering',
    sample: 'Analyze this stack trace and suggest 3 possible causes in order of probability. \n\nStack: \n[STACK_TRACE]',
    theme: 'red'
  },
  {
    id: 'api-designer',
    title: 'REST/GraphQL Interface',
    desc: 'Bespoke API design with focus on developer experience and security.',
    icon: Database,
    category: 'Engineering',
    sample: 'Design a RESTful API for a [service]. Include endpoint definitions, schema, and authentication strategy.',
    theme: 'emerald'
  }
];

export default function Templates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof TEMPLATES[0] | null>(null);

  const filtered = TEMPLATES.filter(t => 
    t.title.toLowerCase().includes(search.toLowerCase()) || 
    t.desc.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col p-10 atmosphere overflow-hidden">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/20 mb-2">
            <Layout className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Blueprint Library</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-white">Forge Templates</h2>
        </div>
        
        <div className="relative w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
          <Input 
            placeholder="Search blueprints..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 h-12 bg-white/5 border-white/5 rounded-2xl text-xs font-medium focus:ring-blue-500/20"
          />
        </div>
      </div>

      <ScrollArea className="flex-1 -mx-2 px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {filtered.map((template, idx) => (
            <motion.div
              key={template.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.05 }}
              onClick={() => setSelected(template)}
              className="glass-card group p-8 cursor-pointer hover:bg-white/[0.04] relative overflow-hidden"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 group-hover:text-blue-400 group-hover:bg-blue-400/10 transition-all duration-500">
                  <template.icon className="w-7 h-7" />
                </div>
                <Badge variant="outline" className="bg-white/5 border-white/5 text-[9px] font-black uppercase tracking-widest text-white/30">
                  {template.category}
                </Badge>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-100 transition-colors">{template.title}</h3>
                <p className="text-xs text-white/30 leading-relaxed line-clamp-2">{template.desc}</p>
              </div>

              <div className="mt-8 flex items-center justify-between">
                <span className="text-[10px] font-black text-blue-500/40 uppercase tracking-widest">View Blueprint</span>
                <ChevronRight className="w-4 h-4 text-white/10 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </motion.div>
          ))}
        </div>
      </ScrollArea>

      <AnimatePresence>
        {selected && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="glass-card w-full max-w-2xl overflow-hidden flex flex-col max-h-[80vh] border-white/10 shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-400">
                      <selected.icon className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-bold text-white">{selected.title}</h3>
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">{selected.category} Template</p>
                   </div>
                </div>
                <button onClick={() => setSelected(null)} className="p-2 rounded-full hover:bg-white/5 text-white/20 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <ScrollArea className="flex-1 p-8">
                <div className="space-y-6">
                   <p className="text-sm text-white/60 leading-relaxed font-medium">{selected.desc}</p>
                   
                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-white/20 uppercase text-[10px] font-black tracking-widest font-mono">
                         <Sparkles className="w-3 h-3" />
                         Output Signature
                      </div>
                      <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 text-[10px] text-blue-400 font-medium italic">
                        "{selected.preview}"
                      </div>
                   </div>

                   <div className="space-y-3">
                      <div className="flex items-center gap-2 text-white/20 uppercase text-[10px] font-black tracking-widest font-mono">
                         <Terminal className="w-3 h-3" />
                         Core Logic
                      </div>
                      <div className="p-6 rounded-2xl bg-black/40 border border-white/5 font-mono text-xs text-white/40 leading-relaxed whitespace-pre-wrap">
                        {selected.sample}
                      </div>
                   </div>
                </div>
              </ScrollArea>

              <div className="p-8 border-t border-white/5 bg-white/[0.01]">
                <Button 
                  onClick={() => {
                    navigate('/forge', { state: { input: selected.sample, category: selected.category.toLowerCase() } });
                  }}
                  className="mac-button-primary w-full h-14"
                >
                  <ExternalLink className="w-4 h-4" />
                  INITIATE FORGE WITH TEMPLATE
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
