import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  Sparkles, MessageSquare, Image as ImageIcon, FileText, 
  Bookmark, Layout, Box, ShoppingBag, 
  BarChart3, Clock, Settings, LogOut, Shield,
  Eye, ListChecks, Key, Terminal
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { motion } from 'motion/react';
import { useAuth } from '@/lib/AuthContext';
import { LogIn } from 'lucide-react';

export function Sidebar() {
  const { t } = useTranslation();
  const { user, signIn, logout, loading } = useAuth();

  const sections = [
    {
      title: t('nav.admin') === 'SYSTEM' ? 'CORE COMMANDS' : 'КОМАНДЫ',
      items: [
        { to: '/forge', icon: Sparkles, label: t('nav.dashboard') },
        { to: '/playground', icon: Terminal, label: 'Playground' },
        { to: '/chat', icon: MessageSquare, label: t('nav.chat') },
        { to: '/vision', icon: ImageIcon, label: t('nav.vision') },
        { to: '/text-tools', icon: FileText, label: t('nav.text_tools'), disabled: true },
      ]
    },
    {
      title: t('nav.library'),
      items: [
        { to: '/saved', icon: Bookmark, label: t('nav.saved') },
        { to: '/templates', icon: Layout, label: t('nav.templates') },
        { to: '/my-templates', icon: Box, label: t('nav.my_templates') },
        { to: '/marketplace', icon: ShoppingBag, label: t('nav.marketplace') },
      ]
    },
    {
      title: t('nav.analytics'),
      items: [
        { to: '/stats', icon: BarChart3, label: t('nav.stats'), disabled: true },
        { to: '/history', icon: Clock, label: t('nav.history') },
      ]
    },
    {
      title: t('nav.admin'),
      items: [
        { to: '/admin/observability', icon: Eye, label: 'Observability' },
        { to: '/admin/diff', icon: ListChecks, label: 'Neural Diff' },
        { to: '/admin/config', icon: Settings, label: 'Engine Config' },
        { to: '/registry', icon: ListChecks, label: 'Prompt Registry', disabled: true },
        { to: '/api-keys', icon: Key, label: 'API Keys', disabled: true },
      ]
    }
  ];

  return (
    <div className="w-64 h-screen glass border-r border-white/5 flex flex-col fixed left-0 top-0 z-40 overflow-y-auto">
      <div className="flex items-center gap-3 px-6 py-10 mb-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Sparkles className="text-white w-5 h-5" />
        </div>
        <h1 className="font-display font-bold text-xl tracking-tight text-white">PromptForge</h1>
      </div>

      <div className="flex-1 px-3 space-y-8 pb-10">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1">
            <h3 className="px-4 text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mb-3">
              {section.title}
            </h3>
            {section.items.map((item) => (
              <NavLink
                key={item.to}
                to={item.disabled ? '#' : item.to}
                onClick={(e) => item.disabled && e.preventDefault()}
                className={({ isActive }) =>
                  cn(
                    "group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 relative",
                    isActive && !item.disabled
                      ? "bg-white/10 text-white" 
                      : "text-white/40 hover:text-white" + (item.disabled ? " cursor-not-allowed opacity-50" : " hover:bg-white/5")
                  )
                }
              >
                <item.icon className={cn("w-4 h-4 transition-colors", "group-hover:text-blue-400")} />
                <span className="text-sm font-semibold">{item.label}</span>
                {item.disabled && (
                  <span className="ml-auto text-[8px] bg-white/5 px-1.5 py-0.5 rounded text-white/30">SOON</span>
                )}
              </NavLink>
            ))}
          </div>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 space-y-4">
        {loading ? (
          <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/5 animate-pulse">
            <div className="w-8 h-8 rounded-lg bg-white/10" />
            <div className="space-y-1">
              <div className="h-2 w-16 bg-white/10 rounded" />
              <div className="h-1.5 w-24 bg-white/5 rounded" />
            </div>
          </div>
        ) : user ? (
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-3 py-2 bg-white/5 rounded-xl border border-white/5 overflow-hidden">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-8 h-8 rounded-lg" />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center text-blue-400 font-bold text-xs">
                  {user.displayName?.[0] || user.email?.[0] || 'U'}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-white truncate">{user.displayName || 'Pilot'}</p>
                <p className="text-[8px] font-medium text-white/40 truncate">{user.email}</p>
              </div>
            </div>
            <button 
              onClick={logout}
              className="group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 w-full text-red-400/60 hover:text-red-400 hover:bg-red-500/10 text-xs font-semibold"
            >
              <LogOut className="w-4 h-4" />
              {t('nav.logout')}
            </button>
          </div>
        ) : (
          <button 
            onClick={signIn}
            className="flex items-center gap-3 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all duration-200 w-full text-white text-xs font-bold shadow-lg shadow-blue-500/20"
          >
            <LogIn className="w-4 h-4" />
            SECURE LOGIN
          </button>
        )}
        
        <NavLink 
          to="/settings" 
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-200 text-xs font-semibold",
              isActive ? "bg-white/10 text-white" : "text-white/40 hover:text-white hover:bg-white/5"
            )
          }
        >
          <Settings className="w-4 h-4" />
          {t('nav.settings')}
        </NavLink>
      </div>
    </div>
  );
}
