// src/hooks/useAchievements.ts
'use client';
import { useCallback, useRef, useState } from 'react';
import { Achievement, ACHIEVEMENTS } from '@/lib/achievements';

export function useAchievements() {
  const [queue, setQueue] = useState<Achievement[]>([]);
  const triggered = useRef<Set<string>>(new Set());

  const trigger = useCallback((id: string) => {
    if (triggered.current.has(id)) return;
    const achievement = ACHIEVEMENTS[id];
    if (!achievement) return;
    triggered.current.add(id);
    setQueue((prev) => [...prev, achievement]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setQueue((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { queue, trigger, dismiss };
}
