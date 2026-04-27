// src/components/ui/SkillBar.tsx
'use client';
import { useEffect, useRef } from 'react';
import styles from './SkillBar.module.css';

interface SkillBarProps {
  name: string;
  level: number;
  animate: boolean;
  delay?: number;
}

export function SkillBar({ name, level, animate, delay = 0 }: SkillBarProps) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || !fillRef.current) return;
    const timeout = setTimeout(() => {
      if (fillRef.current) {
        fillRef.current.style.setProperty('--target-width', `${level}%`);
        fillRef.current.classList.add(styles.animating);
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [animate, level, delay]);

  return (
    <div className={styles.item}>
      <div className={styles.header}>
        <span className={styles.name}>{name}</span>
        <span className={styles.lvl}>LVL {level}</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name} skill level ${level}`}
      >
        <div ref={fillRef} className={styles.fill} />
      </div>
    </div>
  );
}
