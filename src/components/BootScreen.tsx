// src/components/BootScreen.tsx
'use client';
import { useEffect, useState } from 'react';
import styles from './BootScreen.module.css';

const BOOT_LINES = [
  'DIVINE_OS v2.0.25 — KERNEL BOOT SEQUENCE INITIATED',
  '[ OK ] Loading neural interface........................',
  '[ OK ] Mounting project archives.......................',
  '[ OK ] Initialising MERN stack modules.................',
  '[ OK ] Syncing portfolio data..........................',
  '[ WARN ] Exceptional skills detected — proceed with caution',
  '[ OK ] All systems nominal. Welcome.',
  'LOADING DIVINE.EXE ████████████████ 100%',
];

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 400);
        }, 800);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`${styles.boot} ${done ? styles.done : ''}`}>
      {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
        <div
          key={i}
          className={`${styles.line} ${i === 5 ? styles.warn : ''} ${i === 7 ? styles.final : ''}`}
        >
          {line}
        </div>
      ))}
      {visibleLines >= BOOT_LINES.length && (
        <div className={styles.progressWrap}>
          <div className={styles.progressFill} />
        </div>
      )}
    </div>
  );
}
