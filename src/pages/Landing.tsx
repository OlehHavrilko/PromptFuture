import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Cpu, Globe, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black relative overflow-hidden flex flex-col items-center justify-center px-6 selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="absolute inset-0 atmosphere pointer-events-none" />
      
      {/* Cinematic Lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/5 blur-[160px] rounded-full animate-pulse" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-600/5 blur-[160px] rounded-full" />

      <main className="max-w-7xl w-full text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "circOut" }}
          className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full glass border-white/10 text-blue-400 text-[10px] font-black uppercase tracking-[0.3em] mb-12 shadow-2xl shadow-blue-500/10"
        >
          <Sparkles className="w-3.5 h-3.5 animate-pulse" />
          <span>System Evolution v1.2 is Active</span>
        </motion.div>

        <div className="space-y-8 mb-16">
          <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "circOut" }}
            className="text-7xl md:text-[140px] font-display font-bold tracking-tighter leading-[0.8] text-white"
          >
            FORGE THE <br />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-400 to-blue-400 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              FUTURE
            </span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="max-w-xl mx-auto text-lg md:text-xl text-white/30 font-medium leading-relaxed tracking-tight"
          >
            The world's most advanced prompt engineering laboratory. 
            Precision-engineered for the elite AI professional.
          </motion.p>
        </div>

        <motion.div
           initial={{ opacity: 0, scale: 0.95 }}
           animate={{ opacity: 1, scale: 1 }}
           transition={{ duration: 0.8, delay: 0.6 }}
           className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <Button 
            size="lg"
            onClick={() => navigate('/forge')}
            className="h-20 px-16 rounded-3xl bg-white text-black hover:bg-white/90 text-2xl font-black transition-all hover:scale-105 active:scale-[0.98] shadow-[0_0_50px_rgba(255,255,255,0.15)] group"
          >
            Launch Lab
            <ArrowRight className="ml-3 w-8 h-8 group-hover:translate-x-2 transition-transform" />
          </Button>
          
          <Button 
            size="lg"
            variant="outline"
            className="h-20 px-12 rounded-3xl border-white/5 glass hover:bg-white/5 text-xl font-bold text-white/60 tracking-tight"
          >
            View Specs
          </Button>
        </motion.div>

        {/* Feature Matrix */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-40"
        >
          {[
            { icon: Cpu, title: "Neural Logic", desc: "Advanced structural reasoning engine." },
            { icon: ShieldCheck, title: "Audit Node", desc: "Real-time quality verification system." },
            { icon: Zap, title: "Quantum Sync", desc: "Near-zero latency generation cycles." },
            { icon: Globe, title: "Multi-Domain", desc: "Scientific, Creative & Logic presets." }
          ].map((feature, i) => (
            <div key={i} className="glass-card text-left p-10 border-white-[0.02] hover:bg-white/[0.03] group">
              <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-6 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all duration-500">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold mb-3 tracking-tight text-white/90">{feature.title}</h3>
              <p className="text-sm text-white/20 font-medium leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>

      {/* Aesthetic Accents */}
      <div className="absolute left-10 top-1/2 -translate-y-1/2 space-y-4 hidden xl:block">
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
        <p className="text-[8px] font-black text-white/5 uppercase vertical-text tracking-[0.5em]">System Node Offline</p>
      </div>
      
      <div className="absolute right-10 top-1/2 -translate-y-1/2 space-y-4 hidden xl:block">
        <p className="text-[8px] font-black text-white/5 uppercase vertical-text tracking-[0.5em]">Protocol 04 Active</p>
        <div className="w-[1px] h-32 bg-gradient-to-b from-transparent via-white/10 to-transparent" />
      </div>
    </div>
  );
}
