// src/components/AchievementToast.tsx
'use client';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Achievement } from '@/lib/achievements';
import styles from './AchievementToast.module.css';

interface AchievementToastProps {
  queue: Achievement[];
  onDismiss: (id: string) => void;
}

export function AchievementToast({ queue, onDismiss }: AchievementToastProps) {
  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => onDismiss(current.id), 3500);
    return () => clearTimeout(timer);
  }, [current, onDismiss]);

  return (
    <div className={styles.container} aria-live="polite">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            className={styles.toast}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <span className={styles.icon}>🏆</span>
            <div>
              <div className={styles.title}>{current.title}</div>
              <div className={styles.desc}>{current.description}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
