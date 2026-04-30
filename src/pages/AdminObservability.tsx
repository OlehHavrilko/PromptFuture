import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, Shield, TrendingUp, Cpu, 
  Layers, Zap, AlertCircle, CheckCircle2,
  Clock, DollarSign, Database
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from 'react-i18next';

export default function AdminObservability() {
  const { t } = useTranslation();
  const [traces, setTraces] = useState<any[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('llm_traces') || '[]');
    } catch {
      return [];
    }
  });

  const stats = [
    { label: "Total Forge Cycles", value: traces.length.toString(), trend: "+12.5%", icon: Zap, color: "text-blue-500" },
    { 
      label: "Avg. Latency", 
      value: traces.length > 0 ? `${Math.round(traces.reduce((acc, t) => acc + t.latency, 0) / traces.length)}ms` : '0ms', 
      trend: "-40ms", 
      icon: Clock, 
      color: "text-amber-500" 
    },
    { label: "Variant A Perf", value: traces.filter(t => t.variant === 'A').length > 0 ? `${Math.round(traces.filter(t => t.variant === 'A').reduce((acc, t) => acc + t.latency, 0) / traces.filter(t => t.variant === 'A').length)}ms` : '0ms', trend: "Base", icon: Activity, color: "text-white/20" },
    { label: "Variant B Perf", value: traces.filter(t => t.variant === 'B').length > 0 ? `${Math.round(traces.filter(t => t.variant === 'B').reduce((acc, t) => acc + t.latency, 0) / traces.filter(t => t.variant === 'B').length)}ms` : '0ms', trend: "Candidate", icon: TrendingUp, color: "text-blue-400" },
  ];

  const recentTraces = traces.slice(0, 10);

  return (
    <div className="h-screen flex flex-col p-10 atmosphere overflow-hidden">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/20 mb-2">
            <Activity className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">System Telemetry</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-white">Observability Dashboard</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 px-4 py-1 font-black text-[10px] tracking-widest">
             CLUSTER: EU6-MARS
          </Badge>
          <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center animate-pulse">
            <div className="w-2 h-2 rounded-full bg-green-500" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((s, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="glass-card p-6 border-white/5"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-white/5 ${s.color}`}>
                <s.icon className="w-6 h-6" />
              </div>
              <span className="text-[10px] font-black text-green-400">{s.trend}</span>
            </div>
            <p className="text-[10px] font-black uppercase text-white/20 tracking-widest mb-1">{s.label}</p>
            <p className="text-2xl font-display font-bold text-white">{s.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 flex-1 overflow-hidden">
        {/* Real-time Traces */}
        <div className="lg:col-span-2 glass-card border-white/5 bg-white/[0.01] flex flex-col p-0 overflow-hidden">
          <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
            <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Active Trace Stream</h3>
            <span className="text-[10px] font-black text-blue-500/40">LIVE UPDATES</span>
          </div>
          <ScrollArea className="flex-1">
            <div className="p-0">
              {recentTraces.map((t, idx) => (
                <div key={t.id} className="group flex items-center justify-between px-8 py-4 border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors">
                  <div className="flex items-center gap-6">
                    <div className="w-10 h-10 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center text-[10px] font-bold text-white/20">
                      {t.id}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-white/80 line-clamp-1">{t.task}</p>
                      <p className="text-[10px] font-mono text-white/20 uppercase tracking-tighter">{t.model} • {new Date(t.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-10 text-right">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-white/10 uppercase">Latency</p>
                      <p className="text-xs font-mono text-white/40">{t.latency}ms</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-white/10 uppercase">Variant</p>
                      <p className="text-xs font-mono text-white/40">{t.variant}</p>
                    </div>
                    <div className="w-24 flex justify-end">
                      {t.status === 'success' ? (
                        <Badge className="bg-green-500/10 text-green-500 border-none px-3 py-0.5 font-bold text-[9px]">COMPLETED</Badge>
                      ) : (
                        <Badge className="bg-red-500/10 text-red-500 border-none px-3 py-0.5 font-bold text-[9px]">FAILED</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {traces.length === 0 && (
                <div className="flex flex-col items-center justify-center p-20 text-white/10 italic">
                   <Database className="w-10 h-10 mb-4 opacity-10" />
                   No telemetry captured in this node.
                </div>
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Model Market Share */}
        <div className="glass-card border-white/5 bg-white/[0.01] p-8 flex flex-col space-y-8">
          <h3 className="text-sm font-black uppercase tracking-widest text-white/80">Neural Allocation</h3>
          
          {[
            { name: "Gemini 2.5 Flash", usage: 65, color: "bg-blue-500" },
            { name: "Gemini 1.5 Pro", usage: 20, color: "bg-indigo-500" },
            { name: "DeepLogic v4", usage: 10, color: "bg-amber-500" },
            { name: "Surgical Vision", usage: 5, color: "bg-emerald-500" },
          ].map((m, i) => (
            <div key={i} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white/60">{m.name}</span>
                <span className="text-xs font-mono text-white/20">{m.usage}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${m.usage}%` }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                  className={`h-full ${m.color}`} 
                />
              </div>
            </div>
          ))}
          
          <div className="pt-6 mt-auto">
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
              <AlertCircle className="w-4 h-4 text-blue-500 mt-0.5" />
              <p className="text-[10px] text-blue-400/60 leading-relaxed font-medium capitalize">
                Compute cycles are currently optimized for surgical precision.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
