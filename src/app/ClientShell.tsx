// src/app/ClientShell.tsx
'use client';
import { ReactNode, useEffect, useState } from 'react';
import { BootScreen } from '@/components/BootScreen';
import { Cursor } from '@/components/Cursor';
import { HUD } from '@/components/HUD';
import { SectionNav } from '@/components/SectionNav';
import { AchievementToast } from '@/components/AchievementToast';
import { Terminal } from '@/components/Terminal';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useAchievements } from '@/hooks/useAchievements';
import { SECTION_IDS } from '@/lib/sections';

interface ClientShellProps { children: ReactNode; }

export function ClientShell({ children }: ClientShellProps) {
  const [booted, setBooted]       = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const activeId                  = useActiveSection(SECTION_IDS);
  const { queue, trigger, dismiss } = useAchievements();

  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollPct(Math.min(100, pct));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const sectionToAchievement: Record<string, string> = {
      about: 'about', experience: 'experience',
      projects: 'projects', skills: 'skills', contact: 'contact',
    };
    const achievementId = sectionToAchievement[activeId];
    if (achievementId) trigger(achievementId);
  }, [activeId, trigger]);

  const handleBootComplete = () => {
    setBooted(true);
    setTimeout(() => trigger('enter'), 1500);
  };

  return (
    <>
      {!booted && <BootScreen onComplete={handleBootComplete} />}
      <Cursor />
      <HUD activeSection={activeId} scrollPct={scrollPct} />
      <SectionNav activeId={activeId} />
      <AchievementToast queue={queue} onDismiss={dismiss} />
      <Terminal />
      <main style={{ opacity: booted ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        {children}
      </main>
    </>
  );
}
