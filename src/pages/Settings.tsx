import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Settings as SettingsIcon, Globe, Moon, Sun, 
  Cpu, ShieldCheck, Key, Zap, Info, Settings2,
  Database, Bell, Lock, Eye, EyeOff, Save, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useTheme } from 'next-themes';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/lib/AuthContext';
import { db, auth } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function Settings() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const { user, signIn, logout } = useAuth();

  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    photoURL: user?.photoURL || ''
  });

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleUpdateProfile = async () => {
    if (!user) return;
    try {
      await updateProfile(user, {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      });

      await setDoc(doc(db, 'users', user.uid), {
        displayName: profileData.displayName,
        photoURL: profileData.photoURL
      }, { merge: true });

      toast.success("Identity records updated globally");
      window.location.reload(); 
    } catch (err) {
      toast.error("Failed to update identity protocol");
      console.error(err);
    }
  };

  const [apiKeys, setApiKeys] = useState({
    openai: localStorage.getItem('api_key_openai') || '',
    anthropic: localStorage.getItem('api_key_anthropic') || '',
    openrouter: localStorage.getItem('api_key_openrouter') || ''
  });

  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    openrouter: false
  });

  const handleSaveKeys = () => {
    localStorage.setItem('api_key_openai', apiKeys.openai);
    localStorage.setItem('api_key_anthropic', apiKeys.anthropic);
    localStorage.setItem('api_key_openrouter', apiKeys.openrouter);
    toast.success("External neural protocols synchronized");
  };

  const clearKeys = () => {
    setApiKeys({ openai: '', anthropic: '', openrouter: '' });
    localStorage.removeItem('api_key_openai');
    localStorage.removeItem('api_key_anthropic');
    localStorage.removeItem('api_key_openrouter');
    toast.info("API key memory purged");
  };

  const handleLanguageChange = (val: string) => {
    i18n.changeLanguage(val);
    toast.success(`Language protocol set to ${val.toUpperCase()}`);
  };

  const sections = [
    {
      title: "Account & Profile",
      icon: ShieldCheck,
      items: [
        {
          label: "Neural Identity",
          desc: user ? `Synchronized as ${user.displayName || user.email}` : "Unidentified User",
          action: (
            <div className="flex items-center gap-3">
               {user ? (
                 <Dialog>
                   <DialogTrigger render={<Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-[10px] font-black h-8 hover:text-blue-400" />}>
                     MODIFY SCHEMA
                   </DialogTrigger>
                   <DialogContent className="glass border-white/10 bg-black/95 text-white">
                      <DialogHeader>
                        <DialogTitle className="font-display font-bold text-xl">Identity Modification</DialogTitle>
                        <DialogDescription className="text-white/40 text-xs">Update your global neural identifier across the laboratory nodes.</DialogDescription>
                      </DialogHeader>
                      <div className="py-6 space-y-4">
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Visual Avatar URL</Label>
                          <Input 
                            value={profileData.photoURL}
                            onChange={(e) => setProfileData({...profileData, photoURL: e.target.value})}
                            placeholder="https://..."
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-[10px] font-black uppercase tracking-widest text-white/40">Display Identifier</Label>
                          <Input 
                            value={profileData.displayName}
                            onChange={(e) => setProfileData({...profileData, displayName: e.target.value})}
                            placeholder="New Name"
                            className="bg-white/5 border-white/10"
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button onClick={handleUpdateProfile} className="mac-button-primary h-10 w-full">Commit Identity Changes</Button>
                      </DialogFooter>
                   </DialogContent>
                 </Dialog>
               ) : (
                 <Button variant="outline" size="sm" onClick={signIn} className="bg-blue-600/10 border-blue-500/20 text-blue-400 text-[10px] font-black h-8">
                   INITIATE AUTH
                 </Button>
               )}
            </div>
          )
        },
        {
          label: "Session Token",
          desc: user ? "Secure encrypted tunnel established." : "Insecure local-only session.",
          action: user ? (
            <Button variant="ghost" size="sm" onClick={logout} className="text-[10px] font-black uppercase text-red-500/60 hover:text-red-400 hover:bg-red-500/10">
              Terminate Session
            </Button>
          ) : null
        }
      ]
    },
    {
      title: "Interface Configuration",
      icon: Globe,
      items: [
        {
          label: "Visual Theme",
          desc: "Switch between Atmospheric Dark and Clinical Light modes.",
          action: (
            <div className="flex bg-white/5 rounded-xl p-1 gap-1 border border-white/5">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setTheme('light')}
                className={cn("h-8 w-8 p-0 rounded-lg", theme === 'light' ? "bg-white/10 text-white" : "text-white/20")}
              >
                <Sun className="w-3.5 h-3.5" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setTheme('dark')}
                className={cn("h-8 w-8 p-0 rounded-lg", theme === 'dark' ? "bg-white/10 text-white" : "text-white/20")}
              >
                <Moon className="w-3.5 h-3.5" />
              </Button>
            </div>
          )
        },
        {
          label: "Primary Language",
          desc: "System UI and generation language preference.",
          action: (
            <Select value={i18n.language} onValueChange={handleLanguageChange}>
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-xs font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-white/10 bg-black">
                <SelectItem value="en">English (US)</SelectItem>
                <SelectItem value="ru">Русский</SelectItem>
                <SelectItem value="ua">Українська</SelectItem>
              </SelectContent>
            </Select>
          )
        }
      ]
    },
    {
      title: "Neural Engine",
      icon: Cpu,
      items: [
        {
          label: "Optimization Level",
          desc: "Balance between speed and blueprint precision.",
          action: (
            <Select defaultValue="balanced">
              <SelectTrigger className="w-32 bg-white/5 border-white/10 text-xs font-bold">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="glass border-white/10 bg-black">
                <SelectItem value="fast">Quantum (Fast)</SelectItem>
                <SelectItem value="balanced">Balanced</SelectItem>
                <SelectItem value="deep">Deep Logic</SelectItem>
              </SelectContent>
            </Select>
          )
        },
        {
          label: "Auto-Audit",
          desc: "Run quality node verification on every forge.",
          action: <Switch defaultChecked />
        }
      ]
    },
    {
      title: "External Providers",
      icon: Key,
      items: [
        {
          label: "Multi-Engine Support",
          desc: "Configure OpenAI, Anthropic, and OpenRouter integration.",
          action: (
            <Dialog>
              <DialogTrigger render={<Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-[10px] font-black h-8 hover:bg-white/10 hover:text-blue-400" />}>
                MANAGE KEYS
              </DialogTrigger>
              <DialogContent className="glass border-white/10 bg-black/95 text-white max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2 text-xl font-display font-bold">
                    <ShieldCheck className="w-5 h-5 text-blue-500" />
                    Key Management
                  </DialogTitle>
                  <DialogDescription className="text-white/40 text-xs">
                    Your keys are stored locally. They are never sent to our servers.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-6">
                  {['openai', 'anthropic', 'openrouter'].map((key) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label className="text-[10px] font-black uppercase tracking-widest text-white/60">{key} API Key</Label>
                        <button onClick={() => setShowKeys(prev => ({...prev, [key]: !prev[key as keyof typeof prev]}))} className="text-white/20 hover:text-white transition-colors">
                          {showKeys[key as keyof typeof showKeys] ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                        </button>
                      </div>
                      <Input 
                        type={showKeys[key as keyof typeof showKeys] ? "text" : "password"}
                        value={apiKeys[key as keyof typeof apiKeys]}
                        onChange={(e) => setApiKeys(prev => ({...prev, [key]: e.target.value}))}
                        placeholder="sk-..."
                        className="bg-white/5 border-white/10 h-10 text-xs font-mono"
                      />
                    </div>
                  ))}
                </div>

                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="ghost" onClick={clearKeys} className="text-[10px] font-black uppercase text-red-500/60 hover:text-red-500 hover:bg-red-500/10">
                    <Trash2 className="w-3 h-3 mr-2" />
                    Purge All
                  </Button>
                  <Button onClick={handleSaveKeys} className="mac-button-primary h-10 px-6">
                    <Save className="w-4 h-4 mr-2" />
                    Save Protocols
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        }
      ]
    }
  ];

  return (
    <div className={cn(
      "flex flex-col p-4 md:p-10 atmosphere",
      isMobile ? "min-h-screen overflow-y-auto pb-24" : "h-screen overflow-hidden"
    )}>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 md:mb-12 gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-white/20 mb-2">
            <SettingsIcon className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t('settings.title')}</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-white tracking-tight">System Protocol</h2>
        </div>
        <Badge className="bg-green-500/10 text-green-400 border-none px-4 py-1 font-black text-[10px] tracking-widest uppercase w-fit">
           ENGINE ONLINE: GEMINI 3 FLASH
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 overflow-y-auto pr-0 md:pr-4 -mr-0 md:-mr-4 pb-20 scrollbar-hide">
        <AnimatePresence>
          {sections.map((section, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3 pb-4 border-b border-white/5">
                <section.icon className="w-5 h-5 text-blue-500" />
                <h3 className="text-sm font-black uppercase tracking-widest text-white/80">{section.title}</h3>
              </div>
              
              <div className="space-y-8">
                {section.items.map((item, iIdx) => (
                  <div key={iIdx} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6 group">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white/90 group-hover:text-blue-400 transition-colors">{item.label}</p>
                      <p className="text-xs text-white/20 font-medium leading-relaxed max-w-sm">{item.desc}</p>
                    </div>
                    <div className="flex justify-start sm:justify-end">
                      {item.action}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        <div className="lg:col-span-2 mt-6 md:mt-10 glass p-6 md:p-8 rounded-3xl border-white/5 bg-white/[0.01] flex flex-col md:flex-row items-center justify-between gap-6">
           <div className="flex flex-wrap items-center justify-center md:justify-start gap-6 md:gap-10">
              <div className="space-y-1 text-center md:text-left">
                 <p className="text-[10px] font-black text-white/20 uppercase">Forge Cycles</p>
                 <p className="text-xl md:text-2xl font-display font-bold text-white">1,284</p>
              </div>
              <div className="space-y-1 text-center md:text-left">
                 <p className="text-[10px] font-black text-white/20 uppercase">Success Rate</p>
                 <p className="text-xl md:text-2xl font-display font-bold text-green-500">99.8%</p>
              </div>
              <div className="space-y-1 text-center md:text-left">
                 <p className="text-[10px] font-black text-white/20 uppercase">Avg Latency</p>
                 <p className="text-xl md:text-2xl font-display font-bold text-blue-400">420ms</p>
              </div>
           </div>
           <Button className="mac-button-primary px-8 h-12 w-full md:w-auto">
              Update Core
           </Button>
        </div>
      </div>
    </div>
  );
}
