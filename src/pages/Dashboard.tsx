import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Copy, Save, Check, RefreshCw, 
  Image as ImageIcon, X, ShieldCheck, 
  ChevronDown, Settings2, Code2, Bug, Database, Layers,
  Terminal, Cpu, Globe, Scale, Zap, Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore } from '@/store/useStore';
import { forgePromptStream, auditPrompt } from '@/services/gemini';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<{ score: number; verdict: string; tips: string[]; metrics: any } | null>(null);
  const [telemetry, setTelemetry] = useState<{ latency: number; tokens: number; status: string } | null>(null);
  const [copied, setCopied] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Settings
  const [length, setLength] = useState<'short' | 'medium' | 'long'>('medium');
  const [category, setCategory] = useState('general');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [image, setImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [showCommands, setShowCommands] = useState(false);
  const [commandFilter, setCommandFilter] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const commands = [
    { cmd: '/role', label: 'Persona', desc: 'Define who the AI is.', text: 'Act as a [role] with [years] of experience in [domain]. Your goal is to [priority].' },
    { cmd: '/format', label: 'Output', desc: 'Specify structure.', text: 'Output the response in the following Markdown format: \n- ' },
    { cmd: '/context', label: 'Context', desc: 'Add background.', text: 'The primary objective of this task is to [objective] for [audience].' },
    { cmd: '/constraints', label: 'Rules', desc: 'Strict boundaries.', text: 'Strict boundaries: \n1. Avoid [topic] \n2. Never [action]' },
    { cmd: '/example', label: 'Sample', desc: 'Few-shot pattern.', text: 'EXAMPLE: \nInput: [input] \nOutput: [output] \n---' }
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setInput(val);

    const match = val.match(/\/(\w*)$/);
    if (match) {
      setShowCommands(true);
      setCommandFilter(match[1]);
    } else {
      setShowCommands(false);
    }
  };

  const insertCommand = (text: string) => {
    const newVal = input.replace(/\/(\w*)$/, text);
    setInput(newVal);
    setShowCommands(false);
  };

  const addHistory = useStore(state => state.addHistory);
  const savePrompt = useStore(state => state.savePrompt);

  // Load from location state (History "Continue")
  useEffect(() => {
    if (location.state?.input) {
      setInput(location.state.input);
      if (location.state.category) setCategory(location.state.category);
      // Clear state to avoid re-fill on refresh
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  // Keyboard Shortcuts
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        handleForge();
      }
      if (e.key === "s" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        if (result) {
          savePrompt({ id: Date.now().toString(), title: input.slice(0, 30), input, result, timestamp: new Date().toISOString() });
          toast.success("Stored in Archive");
        }
      }
    };

    window.addEventListener("keydown", down);
    return () => window.removeEventListener("keydown", down);
  }, [input, result, category, length, image]);

  const handleForge = async () => {
    if (!input.trim() && !image) return;
    setIsGenerating(true);
    setResult('');
    setAuditResult(null);
    setTelemetry(null);
    const startTime = Date.now();
    let fullText = '';
    
    try {
      const stream = forgePromptStream(input, {
        length,
        category,
        image: image ? { inlineData: image } : undefined
      });

      for await (const chunk of stream) {
        fullText += chunk;
        setResult(fullText);
      }
      
      setTelemetry({
        latency: Date.now() - startTime,
        tokens: Math.round(fullText.length / 4),
        status: "STABLE"
      });

      addHistory({
        id: Date.now().toString(),
        input,
        result: fullText,
        options: { length, category, hasImage: !!image },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      toast.error("Forge failure. System overloaded.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAudit = async () => {
    if (!result) return;
    setIsAuditing(true);
    try {
      const audit = await auditPrompt(result);
      setAuditResult(audit);
      toast.success("Audit verification successful");
    } catch (error) {
      toast.error("Audit node failed");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image too large (max 5MB)");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          data: (reader.result as string).split(',')[1],
          mimeType: file.type
        });
        toast.success("Image attached to Forge");
      };
      reader.readAsDataURL(file);
    }
  };

  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          data: (reader.result as string).split(',')[1],
          mimeType: file.type
        });
        toast.success("Image dropped into Forge");
      };
      reader.readAsDataURL(file);
    }
  };

  const templates = [
    { icon: Terminal, title: "Expert Code Review", desc: "SOLID & Clean Code analysis.", cat: "engineering" },
    { icon: Bug, title: "Debug Assistant", desc: "Root cause analysis via stack trace.", cat: "engineering" },
    { icon: Database, title: "API Architect", desc: "REST/GraphQL interface design.", cat: "engineering" },
    { icon: Cpu, title: "System Design", desc: "Microservices & Distributed patterns.", cat: "engineering" }
  ];

  return (
    <div className={cn(
      "flex flex-col pt-4 md:pt-8 pb-4 px-4 md:px-10 atmosphere",
      isMobile ? "min-h-screen overflow-y-auto" : "h-screen overflow-hidden"
    )}>
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 md:mb-8 gap-4">
        <div className="space-y-1">
          <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-2 py-0 text-[10px] font-black uppercase tracking-widest">
            Laboratory Environment v1.2
          </Badge>
          <h2 className="text-2xl md:text-3xl font-display font-bold tracking-tight text-white flex items-center gap-3">
             <Sparkles className="text-blue-500 w-6 h-6 md:w-8 md:h-8" />
             Core Generator
          </h2>
        </div>
        
        <div className="flex gap-4">
          <div className="flex bg-white/5 rounded-2xl p-1 gap-1 border border-white/5 overflow-hidden w-full sm:w-auto">
            {(['short', 'medium', 'long'] as const).map((l) => (
              <button 
                key={l}
                onClick={() => setLength(l)}
                className={cn(
                  "flex-1 sm:flex-none px-3 md:px-4 py-2 rounded-xl text-[10px] font-black transition-all uppercase tracking-widest",
                  length === l ? "bg-white/10 text-white shadow-lg" : "text-white/30 hover:text-white/60"
                )}
              >
                {l}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Split Pane Workspace */}
      <div className={cn(
        "flex-1 grid gap-6 md:gap-10 mb-8",
        isMobile ? "grid-cols-1" : "grid-cols-2 overflow-hidden"
      )}>
        
        {/* LEFT WORKSPACE: INPUT */}
        <div className={cn("flex flex-col gap-6", !isMobile && "overflow-hidden")}>
            <div 
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "glass-card flex-1 flex flex-col p-6 md:p-8 relative group border-white/5 bg-white/[0.02] transition-all duration-300 min-h-[300px]",
                isDragging && "border-blue-500/50 bg-blue-500/5 scale-[1.01]"
              )}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2 text-white/20">
                  <Settings2 className="w-4 h-4" />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em]">Input Intent</span>
                </div>
                <div className="flex items-center gap-2">
                  {image && (
                    <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[9px] px-2">
                      IMAGE ATTACHED
                    </Badge>
                  )}
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                      image ? "bg-blue-500 text-white" : "bg-white/5 text-white/40 hover:text-blue-400"
                    )}
                  >
                    <ImageIcon className="w-3 h-3" />
                    {image ? "Change Image" : "Attach Image"}
                  </button>
                </div>
                <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden accept="image/*" />
              </div>
              
              <Textarea
                value={input}
                onChange={handleInputChange}
                placeholder="Describe your prompt requirements or paste raw ideas... (Try /role)"
                className="flex-1 bg-transparent border-none focus-visible:ring-0 text-xl resize-none p-0 placeholder:text-white/5 font-medium leading-relaxed scrollbar-hide"
              />

              {showCommands && (
                <div className="absolute bottom-20 left-8 right-8 glass p-2 rounded-2xl border border-white/10 z-50 shadow-2xl">
                  <div className="p-2 border-b border-white/5 mb-2">
                    <span className="text-[10px] font-black uppercase text-white/20 tracking-widest">Select Building Block</span>
                  </div>
                  <div className="grid grid-cols-1 gap-1">
                    {commands.filter(c => c.cmd.includes(commandFilter)).map((c) => (
                      <button 
                        key={c.cmd}
                        onClick={() => insertCommand(c.text)}
                        className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors text-left group"
                      >
                        <div className="flex items-center gap-4">
                           <span className="text-sm font-mono text-blue-400 font-bold">{c.cmd}</span>
                           <div className="h-4 w-[1px] bg-white/10" />
                           <span className="text-xs font-bold text-white/70 group-hover:text-white">{c.label}</span>
                        </div>
                        <span className="text-[10px] text-white/20 font-medium">{c.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {image && (
                <div className="mt-6 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 group/img relative">
                  <div className="relative">
                    <img 
                      src={`data:${image.mimeType};base64,${image.data}`} 
                      className="w-20 h-20 rounded-xl object-cover border border-white/10 shadow-xl" 
                      alt="Ref" 
                    />
                    <div className="absolute inset-0 bg-blue-500/20 rounded-xl opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                      <ImageIcon className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest mb-1">Visual Reference</p>
                    <p className="text-xs text-white/60 font-medium">Image attached for structural analysis</p>
                    <button 
                      onClick={() => setImage(null)}
                      className="mt-2 text-[10px] font-black text-red-500/60 hover:text-red-400 uppercase tracking-widest flex items-center gap-2 transition-colors"
                    >
                      <X className="w-3 h-3" />
                      Remove Attachment
                    </button>
                  </div>
                </div>
              )}
            </div>

          <div className="flex gap-4">
             <motion.div 
               className="flex-1"
               whileHover={{ scale: 1.01 }}
               whileTap={{ scale: 0.99 }}
             >
               <div className="h-14 glass border-white/5 rounded-2xl px-6 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] font-black text-white/30 truncate">Category:</span>
                  </div>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="w-32 bg-transparent border-none focus:ring-0 text-xs font-bold text-white/80">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="glass border-white/10 bg-black/95 backdrop-blur-xl">
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="engineering">Engineering</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="academic">Academic</SelectItem>
                    </SelectContent>
                  </Select>
               </div>
             </motion.div>
             
             <motion.div
               whileHover={{ scale: 1.02, y: -2 }}
               whileTap={{ scale: 0.98 }}
             >
               <Button 
                  onClick={handleForge} 
                  disabled={isGenerating || (!input.trim() && !image)}
                  className={cn(
                    "mac-button-primary h-14 px-10 min-w-[200px] transition-all",
                    isGenerating && "brightness-125 shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                  )}
                >
                  <motion.div
                    animate={isGenerating ? { rotate: 360 } : {}}
                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                    className="flex items-center justify-center"
                  >
                    {isGenerating ? <RefreshCw className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </motion.div>
                  <span className="ml-2">{isGenerating ? "FORGING" : "GENERATE"}</span>
                </Button>
             </motion.div>
          </div>
        </div>

        {/* RIGHT WORKSPACE: OUTPUT */}
        <div className={cn(
          "glass-card flex flex-col p-0 relative border-white/10 bg-white/[0.01] min-h-[300px]",
          !isMobile && "overflow-hidden"
        )}>
          <div className="flex-1 flex flex-col min-h-0">
            <div className="px-6 md:px-8 py-4 md:py-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em]">Output Blueprint</h3>
              </div>
              <div className="flex gap-1">
                <Button variant="ghost" size="sm" className="h-9 w-9 rounded-xl text-white/20 hover:text-white" onClick={() => {
                  navigator.clipboard.writeText(result);
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                  toast.success("Blueprint Copied");
                }}>
                  {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                </Button>
                <Button variant="ghost" size="sm" className="h-9 w-9 rounded-xl text-white/20 hover:text-white" onClick={() => {
                   savePrompt({ id: Date.now().toString(), title: input.slice(0, 30), input, result, timestamp: new Date().toISOString() });
                   toast.success("Stored in Archive");
                }}>
                  <Save className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <AnimatePresence mode="wait">
                {!result && !isGenerating ? (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="h-[300px] flex flex-col items-center justify-center text-white/5 text-center space-y-6"
                  >
                    <div className="w-20 h-20 rounded-full border border-dashed border-white/10 flex items-center justify-center">
                      <Layers className="w-10 h-10 opacity-20" />
                    </div>
                    <p className="font-display text-sm font-medium">Ready for input commands</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="output"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="space-y-8"
                  >
                    {isGenerating && !result && (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex items-center justify-center py-20"
                      >
                        <RefreshCw className="w-10 h-10 text-blue-500/20 animate-spin" />
                      </motion.div>
                    )}
                    
                    {result && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="font-mono text-sm leading-relaxed text-white/70 whitespace-pre-wrap selection:bg-blue-500/20 selection:text-white"
                      >
                        {result}
                      </motion.div>
                    )}

                    {auditResult && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 rounded-3xl bg-blue-500/5 border border-blue-500/10 space-y-6"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3 text-blue-400">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-[11px] font-black uppercase tracking-[0.2em]">Safety & Quality Node</span>
                          </div>
                          <Badge className="bg-blue-500/20 text-blue-400 border-none font-black text-xs">
                            SCORE: {auditResult.score}/10
                          </Badge>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pb-4 border-b border-white/5">
                          {Object.entries(auditResult.metrics || {}).map(([key, val]) => (
                            <div key={key} className="space-y-1">
                              <p className="text-[8px] text-white/20 uppercase font-black">{key}</p>
                              <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                                 <motion.div 
                                   initial={{ width: 0 }}
                                   animate={{ width: `${(val as number) * 10}%` }}
                                   transition={{ duration: 1, ease: "easeOut" }}
                                   className="h-full bg-blue-500" 
                                 />
                              </div>
                            </div>
                          ))}
                        </div>

                        <div className="space-y-2">
                           <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Verdict</p>
                           <p className="text-xs text-white/70 leading-relaxed italic">"{auditResult.verdict}"</p>
                        </div>

                        <div className="space-y-3">
                           <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Enhancements</p>
                           <ul className="space-y-2">
                             {auditResult.tips.map((tip, i) => (
                               <motion.li 
                                 key={i}
                                 initial={{ opacity: 0, x: -10 }}
                                 animate={{ opacity: 1, x: 0 }}
                                 transition={{ delay: i * 0.1 }}
                                 className="text-[11px] text-white/50 flex gap-3"
                               >
                                 <span className="text-blue-500/40">0{i+1}</span>
                                 {tip}
                               </motion.li>
                             ))}
                           </ul>
                        </div>
                      </motion.div>
                    )}

                    {telemetry && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 space-y-4"
                      >
                        <div className="flex items-center gap-2 text-white/10">
                          <Terminal className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-[0.3em]">Telemetry Stream</span>
                        </div>
                        <div className="grid grid-cols-3 gap-8">
                           <div className="space-y-1">
                             <span className="text-[8px] text-white/20 uppercase font-black">Latency</span>
                             <p className="text-[10px] font-mono text-white/60">{telemetry.latency}ms</p>
                           </div>
                           <div className="space-y-1">
                             <span className="text-[8px] text-white/20 uppercase font-black">Est. Tokens</span>
                             <p className="text-[10px] font-mono text-white/60">{telemetry.tokens}</p>
                           </div>
                           <div className="space-y-1">
                             <span className="text-[8px] text-white/20 uppercase font-black">Status</span>
                             <p className="text-[10px] font-mono text-green-500/60">{telemetry.status}</p>
                           </div>
                        </div>
                      </motion.div>
                    )}

                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="p-8 rounded-3xl border border-white/5 bg-white/[0.01] space-y-4"
                    >
                      <div className="flex items-center gap-3 text-white/20">
                        <Info className="w-4 h-4" />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em]">Operational Framework</span>
                      </div>
                      <div className="space-y-3">
                        <p className="text-xs text-white/40 leading-relaxed font-medium">
                          PromptForge utilizes a <span className="text-blue-400">multi-layer engineering cycle</span> to ensure maximum model alignment:
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                           {[
                             { l: "Role", d: "Strategic persona assignment" },
                             { l: "Context", d: "Environmental constraints" },
                             { l: "Task", d: "Primary objective logic" },
                             { l: "Output", d: "Structural markdown formatting" }
                           ].map((item, i) => (
                             <div key={i} className="p-3 bg-black/40 rounded-xl border border-white/5">
                                <p className="text-[9px] font-black uppercase text-blue-500/60 mb-1">{item.l}</p>
                                <p className="text-[10px] text-white/30 font-bold">{item.d}</p>
                             </div>
                           ))}
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </ScrollArea>
          </div>
          
          <div className="p-4 bg-black/20 border-t border-white/5">
            <Button 
                onClick={handleAudit} 
                disabled={!result || isAuditing}
                variant="ghost" 
                className={cn(
                  "w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  result ? "text-blue-400 hover:bg-blue-400/10" : "text-white/10"
                )}
              >
                {isAuditing ? <RefreshCw className="w-3 h-3 animate-spin mr-3 text-blue-400" /> : <ShieldCheck className="w-3 h-3 mr-3" />}
                Run Quality Verification
            </Button>
          </div>
        </div>
      </div>

      {/* FOOTER: QUICK TEMPLATES */}
      <div className={cn("flex flex-col", isMobile ? "mt-4 h-auto pb-10" : "h-44")}>
        <div className="px-2 mb-4 flex items-center justify-between">
           <h4 className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Quick Forge Templates</h4>
           <button className="text-[10px] font-bold text-blue-500/60 hover:text-blue-400 underline decoration-blue-500/20 underline-offset-4">Browse</button>
        </div>
        <div className={cn(
          "grid gap-4 md:gap-6",
          isMobile ? "grid-cols-1 sm:grid-cols-2" : "grid-cols-4"
        )}>
          {templates.map((t, i) => (
            <motion.button 
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ 
                scale: 1.05, 
                y: -5,
                backgroundColor: "rgba(255, 255, 255, 0.05)" 
              }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setInput(`Forging a high-level ${t.title.toLowerCase()}... \nRequirements: \n- `);
                setCategory(t.cat);
              }}
              className="glass p-5 text-left group flex items-start gap-5 transition-all duration-300 rounded-2xl border border-white/5"
            >
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/30 group-hover:text-blue-400 group-hover:bg-blue-500/10 group-hover:rotate-12 transition-all duration-500">
                <t.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h5 className="font-bold text-sm text-white/90 group-hover:text-blue-100 transition-colors truncate mb-1">{t.title}</h5>
                <p className="text-[10px] text-white/20 font-medium leading-normal line-clamp-2">{t.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
