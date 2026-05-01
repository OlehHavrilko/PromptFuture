import React from 'react';
import { NavLink } from 'react-router-dom';
import { Zap, Beaker, Save, History, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

export function MobileNav() {
  const items = [
    { to: '/forge', icon: Zap, label: 'Forge' },
    { to: '/playground', icon: Beaker, label: 'Lab' },
    { to: '/saved', icon: Save, label: 'Saved' },
    { to: '/history', icon: History, label: 'History' },
    { to: '/settings', icon: Settings, label: 'Setup' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 glass-top border-t border-white/5 flex items-center justify-around px-2 z-50 md:hidden">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center gap-1 w-full h-full transition-all duration-300",
              isActive ? "text-blue-400" : "text-white/40 hover:text-white/60"
            )
          }
        >
          {({ isActive }) => (
            <>
              <item.icon className="w-5 h-5" />
              <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
              {/* Active indicator */}
              <div
                className={cn(
                  "absolute bottom-0 h-0.5 w-8 rounded-full bg-blue-500 transition-all duration-300 opacity-0",
                  isActive && "opacity-100 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                )}
              />
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
}
