import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Camera, Upload, X, Sparkles, RefreshCw, 
  Copy, ShieldCheck, Zap, Info, Layers, Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useStore } from '@/store/useStore';
import { forgePromptStream } from '@/services/gemini';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function VisionAnalyzer() {
  const [image, setImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage({
          data: (reader.result as string).split(',')[1],
          mimeType: file.type
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const startAnalysis = async () => {
    if (!image) return;
    setIsAnalyzing(true);
    setAnalysis('');
    
    try {
      const stream = forgePromptStream(
        "Analyze this image in extreme technical detail. Describe lighting, composition, camera settings (est.), color theory, and subjects. Then, provide a high-level descriptive prompt and a Stable Diffusion/Midjourney style prompt.", 
        {
          length: 'long',
          category: 'creative',
          image: { inlineData: image }
        }
      );

      for await (const chunk of stream) {
        setAnalysis(prev => prev + chunk);
      }
    } catch (error) {
      toast.error("Optical node failure.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="h-screen flex flex-col p-10 atmosphere overflow-hidden">
      <div className="flex items-center justify-between mb-12">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/20 mb-2">
            <Eye className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Visual Intelligence</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-white">Vision Analyzer</h2>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-hidden mb-10">
        {/* Upload Zone */}
        <div className="flex flex-col gap-6">
          <div 
            onClick={() => !image && fileInputRef.current?.click()}
            className={cn(
              "flex-1 rounded-[40px] border-2 border-dashed transition-all flex flex-col items-center justify-center p-10 overflow-hidden relative group cursor-pointer",
              image ? "border-blue-500/20 bg-blue-500/5" : "border-white/10 hover:border-blue-500/40 hover:bg-white/[0.02]"
            )}
          >
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} hidden accept="image/*" />
            
            <AnimatePresence mode="wait">
              {!image ? (
                <motion.div 
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center text-center space-y-6"
                >
                  <div className="w-24 h-24 rounded-full bg-white/5 flex items-center justify-center text-white/20 group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-all duration-500">
                    <Upload className="w-10 h-10" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-white/60">Drop visual asset here</p>
                    <p className="text-xs text-white/20 font-medium uppercase tracking-[0.2em]">Supports PNG, JPG up to 10MB</p>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="image"
                  initial={{ opacity: 0, scale: 1.1 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 p-4"
                >
                  <img 
                    src={`data:${image.mimeType};base64,${image.data}`} 
                    className="w-full h-full object-contain rounded-3xl"
                    alt="Visualization"
                  />
                  <button 
                    onClick={(e) => { e.stopPropagation(); setImage(null); }}
                    className="absolute top-8 right-8 p-3 bg-black/60 backdrop-blur-xl rounded-2xl border border-white/10 text-white/60 hover:text-red-400 transition-colors shadow-2xl"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Button 
            onClick={startAnalysis}
            disabled={!image || isAnalyzing}
            className="mac-button-primary h-20 text-xl font-black rounded-3xl"
          >
            {isAnalyzing ? <RefreshCw className="w-6 h-6 animate-spin mr-4" /> : <Zap className="w-6 h-6 mr-4" fill="currentColor" />}
            {isAnalyzing ? "ANALYZING..." : "REVERSE ENGINEER ARCHITECTURE"}
          </Button>
        </div>

        {/* Output Zone */}
        <div className="glass-card flex flex-col p-0 overflow-hidden relative border-white/10 bg-white/[0.01]">
           <div className="px-8 py-6 border-b border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                <h3 className="text-[10px] font-black text-white/40 uppercase tracking-[0.25em]">Optical Analysis Stream</h3>
              </div>
              <Button variant="ghost" size="sm" className="h-9 px-4 rounded-xl text-white/40 hover:text-white" onClick={() => {
                 navigator.clipboard.writeText(analysis);
                 toast.success("Analysis Copied");
              }}>
                <Copy className="w-4 h-4 mr-2" />
                <span className="text-[10px] font-black uppercase">Copy Report</span>
              </Button>
           </div>
           
           <div className="flex-1 overflow-y-auto p-10 font-mono text-sm leading-relaxed text-white/70 whitespace-pre-wrap selection:bg-blue-500/20">
              {!analysis && !isAnalyzing && (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                   <Layers className="w-12 h-12 text-white/5" />
                   <p className="text-white/20 font-medium">Capture data from visual source...</p>
                </div>
              )}
              {analysis}
           </div>
        </div>
      </div>
    </div>
  );
}
