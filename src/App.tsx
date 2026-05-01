import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileNav } from '@/components/layout/MobileNav';
import Landing from '@/pages/Landing';
import Dashboard from '@/pages/Dashboard';
import PromptChat from '@/pages/PromptChat';
import History from '@/pages/History';
import SavedPrompts from '@/pages/SavedPrompts';
import Settings from '@/pages/Settings';
import VisionAnalyzer from '@/pages/VisionAnalyzer';
import Templates from '@/pages/Templates';
import AdminObservability from '@/pages/AdminObservability';
import AdminPromptDiff from '@/pages/AdminPromptDiff';
import AdminPromptConfig from '@/pages/AdminPromptConfig';
import PromptPlayground from '@/pages/PromptPlayground';
import Placeholder from '@/pages/Placeholder';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import '@/i18n/config';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { AuthProvider } from '@/lib/AuthContext';

function AppLayout() {
  const location = useLocation();
  const { theme } = useTheme();
  const isLanding = location.pathname === '/';

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden selection:bg-blue-500/30 selection:text-white">
      {!isLanding && (
        <div className="hidden md:block">
          <motion.div 
            initial={{ x: -260 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <Sidebar />
          </motion.div>
        </div>
      )}
      {!isLanding && <MobileNav />}
      <main className={cn(
        "flex-1 transition-all duration-700 min-h-screen overflow-y-auto atmosphere relative pb-20 md:pb-0",
        !isLanding && "md:ml-64"
      )}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Routes location={location}>
              <Route path="/" element={<Landing />} />
              <Route path="/forge" element={<Dashboard />} />
              <Route path="/chat" element={<PromptChat />} />
              <Route path="/history" element={<History />} />
              <Route path="/saved" element={<SavedPrompts />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/vision" element={<VisionAnalyzer />} />
              <Route path="/text-tools" element={<Placeholder title="Core Utilities" />} />
              <Route path="/templates" element={<Templates />} />
              <Route path="/admin/observability" element={<AdminObservability />} />
              <Route path="/admin/diff" element={<AdminPromptDiff />} />
              <Route path="/admin/config" element={<AdminPromptConfig />} />
              <Route path="/playground" element={<PromptPlayground />} />
              <Route path="/my-templates" element={<Placeholder title="Private Laboratory" />} />
              <Route path="/marketplace" element={<Placeholder title="Global Marketplace" />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
      <AuthProvider>
        <Router>
          <AppLayout />
          <Toaster position="bottom-right" richColors />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}
