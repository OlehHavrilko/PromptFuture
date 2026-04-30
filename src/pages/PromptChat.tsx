import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, Send, Bot, User, RefreshCw, 
  Sparkles, Terminal, Copy, Check, Bookmark, Trash2,
  ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { refinePromptStream } from '@/services/gemini';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export default function PromptChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isProcessing) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsProcessing(true);

    const modelMessageId = (Date.now() + 1).toString();
    const history = messages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    try {
      setMessages(prev => [...prev, {
        id: modelMessageId,
        role: 'model',
        text: '',
        timestamp: new Date()
      }]);

      let fullResponse = '';
      const stream = refinePromptStream(history, input);

      for await (const chunk of stream) {
        fullResponse += chunk;
        setMessages(prev => prev.map(m => 
          m.id === modelMessageId ? { ...m, text: fullResponse } : m
        ));
      }
    } catch (error) {
      toast.error("Communication link severed.");
      setMessages(prev => prev.filter(m => m.id !== modelMessageId));
    } finally {
      setIsProcessing(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast.success("Conversation cache purged");
  };

  return (
    <div className="h-screen flex flex-col p-10 atmosphere overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/20 mb-2">
            <MessageSquare className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Neural Link</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-white">Conversation Engine</h2>
        </div>
        
        <Button 
          variant="ghost" 
          onClick={clearChat}
          className="h-11 px-6 rounded-xl text-white/20 hover:text-red-400 hover:bg-red-500/10 text-xs font-bold"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Purge Cache
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 glass-card border-white/5 bg-white/[0.01] flex flex-col overflow-hidden mb-8">
        <ScrollArea className="flex-1">
           <div ref={scrollRef} className="p-8 space-y-10">
              {messages.length === 0 && (
                <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-20 h-20 rounded-[32px] bg-blue-500/5 border border-dashed border-blue-500/20 flex items-center justify-center text-blue-500/20">
                    <Bot className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-white/40 font-bold">Awaiting neural commands</p>
                    <p className="text-white/10 text-xs max-w-xs leading-relaxed uppercase tracking-widest font-black">Iteratively refine your blueprints through natural dialogue.</p>
                  </div>
                </div>
              )}

              {messages.map((message, idx) => (
                <motion.div 
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 260, 
                    damping: 20,
                    delay: 0.05
                  }}
                  key={message.id}
                  className={cn(
                    "flex gap-6 group",
                    message.role === 'user' ? "flex-row-reverse" : "flex-row"
                  )}
                >
                  <div className={cn(
                    "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 border transition-transform duration-500 group-hover:scale-110",
                    message.role === 'user' 
                      ? "bg-white/5 border-white/10 text-white/40" 
                      : "bg-gradient-to-tr from-blue-600 to-indigo-600 text-white border-blue-400/20 shadow-lg shadow-blue-500/20"
                  )}>
                    {message.role === 'user' ? <User className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                  </div>

                  <div className={cn(
                    "flex flex-col gap-2 max-w-[80%] transition-transform duration-300",
                    message.role === 'user' ? "items-end text-right" : "items-start text-left"
                  )}>
                    <div className={cn(
                      "px-6 py-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap transition-all duration-300",
                      message.role === 'user' 
                        ? "bg-white/5 text-white/70 rounded-tr-none border border-white/5 hover:bg-white/10" 
                        : "bg-blue-500/5 text-white/90 border border-blue-500/10 rounded-tl-none font-mono hover:bg-blue-500/[0.08]"
                    )}>
                      {message.text || (
                        <div className="flex gap-1.5 py-2 px-1">
                          <motion.div 
                            animate={{ opacity: [0.2, 1, 0.2] }} 
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0 }}
                            className="w-1.5 h-1.5 rounded-full bg-blue-400" 
                          />
                          <motion.div 
                            animate={{ opacity: [0.2, 1, 0.2] }} 
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                            className="w-1.5 h-1.5 rounded-full bg-blue-400" 
                          />
                          <motion.div 
                            animate={{ opacity: [0.2, 1, 0.2] }} 
                            transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }}
                            className="w-1.5 h-1.5 rounded-full bg-blue-400" 
                          />
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-3 px-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="text-[10px] font-mono text-white/10">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.role === 'model' && (
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(message.text);
                            setCopiedId(message.id);
                            toast.success("Instruction copied");
                            setTimeout(() => setCopiedId(null), 2000);
                          }}
                          className="text-[10px] font-black text-blue-500/40 hover:text-blue-400 transition-colors uppercase tracking-widest"
                        >
                          {copiedId === message.id ? 'Copied' : 'Copy blueprint'}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
           </div>
        </ScrollArea>

        {/* Input Control */}
        <div className="p-6 bg-black/40 border-t border-white/5">
           <div className="relative group">
              <div className="absolute inset-0 bg-blue-500/5 rounded-3xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity" />
              <div className="relative glass border-white/5 rounded-3xl p-2 flex items-end gap-2 pr-4 shadow-2xl">
                 <Textarea 
                   value={input}
                   onChange={(e) => setInput(e.target.value)}
                   onKeyDown={(e) => {
                     if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend();
                     }
                   }}
                   placeholder="Refine instruction logic..."
                   className="flex-1 bg-transparent border-none focus-visible:ring-0 text-sm py-4 px-6 resize-none min-h-[60px] max-h-40 placeholder:text-white/10"
                 />
                 <Button 
                   onClick={handleSend}
                   disabled={isProcessing || !input.trim()}
                   className="w-12 h-12 rounded-2xl bg-white text-black hover:bg-white/90 mb-1 flex-shrink-0 transition-all hover:scale-105 active:scale-95"
                 >
                   <Send className="w-5 h-5" />
                 </Button>
              </div>
           </div>
           <div className="mt-4 flex items-center justify-center gap-6">
              <p className="text-[9px] text-white/5 font-black uppercase tracking-[0.4em]">Iterative Refinement Mode v1.0</p>
           </div>
        </div>
      </div>
    </div>
  );
}
