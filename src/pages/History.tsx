import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { motion } from 'motion/react';
import { Clock, Search, Trash2, Copy, Sparkles, ExternalLink, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export default function History() {
  const navigate = useNavigate();
  const history = useStore(state => state.history);
  const clearHistory = useStore(state => state.clearHistory);
  const [search, setSearch] = React.useState('');
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filtered = history.filter(h => 
    h.input.toLowerCase().includes(search.toLowerCase()) || 
    h.result.toLowerCase().includes(search.toLowerCase())
  ).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className={cn(
      "flex flex-col p-4 md:p-10 atmosphere",
      isMobile ? "min-h-screen overflow-y-auto pb-24" : "h-screen overflow-hidden"
    )}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-10 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/20 mb-2">
            <Clock className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Sequence Log</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">Generation History</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input 
              placeholder="Search sequences..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-white/5 border-white/5 rounded-xl text-xs font-medium focus:ring-blue-500/20 w-full"
            />
          </div>
          <Button 
            variant="ghost" 
            onClick={clearHistory}
            className="h-11 px-6 rounded-xl text-red-500/60 hover:text-red-400 hover:bg-red-500/10 text-xs font-bold w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Purge Log
          </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 -mx-4 px-4">
        {filtered.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/10">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white/40 font-bold">No records found</p>
              <p className="text-white/10 text-xs">Execute a forge command to begin logging.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 pb-10">
            {filtered.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                key={item.id}
                className="glass-card group p-6 hover:bg-white/[0.03] transition-all border-white/5"
              >
                <div className="flex items-start justify-between gap-6 mb-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <Badge className="bg-blue-500/10 text-blue-400 border-none px-2 py-0.5 text-[8px] font-black uppercase">
                        {item.options?.category || 'General'}
                      </Badge>
                      <span className="text-[10px] font-mono text-white/20">
                        {format(new Date(item.timestamp), 'MMM dd, HH:mm:ss')}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white/80 line-clamp-1">{item.input}</h3>
                  </div>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-white/40 hover:text-blue-400" onClick={() => {
                        navigate('/forge', { state: { input: item.input, category: item.options?.category } });
                    }}>
                      <Play className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-white/40 hover:text-white" onClick={() => {
                        navigator.clipboard.writeText(item.result);
                        toast.success("Blueprint Copied");
                    }}>
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-white/40 hover:text-white">
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
                
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                   <p className="text-xs text-white/30 font-mono line-clamp-3 leading-relaxed">
                     {item.result}
                   </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
