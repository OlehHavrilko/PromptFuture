import React from 'react';
import { useStore } from '@/store/useStore';
import { motion } from 'motion/react';
import { Bookmark, Search, Trash2, Copy, Edit3, Grid, List as ListIcon, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function SavedPrompts() {
  const savedPrompts = useStore(state => state.savedPrompts);
  const deletePrompt = useStore(state => state.deletePrompt);
  const [search, setSearch] = React.useState('');
  const [view, setView] = React.useState<'grid' | 'list'>('grid');

  const handleShare = (id: string) => {
    const shareUrl = `${window.location.origin}/p/${id}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success("Public share link copied to clipboard");
  };

  const filtered = savedPrompts.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) || 
    p.result.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="h-screen flex flex-col p-10 atmosphere overflow-hidden">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/20 mb-2">
            <Bookmark className="w-4 h-4 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Stored Archive</span>
          </div>
          <h2 className="text-4xl font-display font-bold text-white">Private Library</h2>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex bg-white/5 rounded-xl p-1 border border-white/5">
            <button 
              onClick={() => setView('grid')}
              className={cn("p-2 rounded-lg transition-all", view === 'grid' ? "bg-white/10 text-white" : "text-white/20")}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setView('list')}
              className={cn("p-2 rounded-lg transition-all", view === 'list' ? "bg-white/10 text-white" : "text-white/20")}
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
            <Input 
              placeholder="Search library..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-11 bg-white/5 border-white/5 rounded-xl text-xs font-medium focus:ring-blue-500/20"
            />
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1 -mx-4 px-4">
        {filtered.length === 0 ? (
          <div className="h-[400px] flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-white/10">
              <Bookmark className="w-8 h-8" />
            </div>
            <div>
              <p className="text-white/40 font-bold">Archive is empty</p>
              <p className="text-white/10 text-xs">Save your first blueprint from the generator.</p>
            </div>
          </div>
        ) : (
          <div className={cn(
            "pb-10",
            view === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" : "space-y-4"
          )}>
            {filtered.map((item, idx) => (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                key={item.id}
                className="glass-card group flex flex-col border-white/5 hover:bg-white/[0.03] transition-all"
              >
                <div className="p-6 flex-1 flex flex-col space-y-4">
                  <div className="flex items-start justify-between">
                    <h3 className="font-bold text-white/90 group-hover:text-blue-400 transition-colors line-clamp-2 leading-tight">
                      {item.title || "Untitled Blueprint"}
                    </h3>
                  </div>
                  
                  <div className="flex-1 bg-black/40 rounded-xl p-4 border border-white/5 max-h-40 overflow-hidden relative">
                    <p className="text-[10px] font-mono text-white/30 leading-relaxed">
                      {item.result}
                    </p>
                    <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-black/80 to-transparent" />
                  </div>
                </div>

                <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between bg-white/[0.01]">
                   <span className="text-[9px] font-black text-white/10 uppercase tracking-widest">
                     {new Date(item.timestamp).toLocaleDateString()}
                   </span>
                   <div className="flex gap-2 text-white/40">
                     <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-white/20 hover:text-blue-400" onClick={() => handleShare(item.id)}>
                        <Share2 className="w-3.5 h-3.5" />
                     </Button>
                     <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-white/20 hover:text-white" onClick={() => {
                        navigator.clipboard.writeText(item.result);
                        toast.success("Copied to clipboard");
                     }}>
                        <Copy className="w-3.5 h-3.5" />
                     </Button>
                     <Button variant="ghost" size="sm" className="h-8 w-8 rounded-lg text-white/20 hover:text-red-400" onClick={() => deletePrompt(item.id)}>
                        <Trash2 className="w-3.5 h-3.5" />
                     </Button>
                   </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
}
