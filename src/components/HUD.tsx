// src/components/HUD.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './HUD.module.css';

interface HUDProps {
  activeSection: string;
  scrollPct: number;
}

export function HUD({ activeSection, scrollPct }: HUDProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [fps, setFps]       = useState(60);
  const frameCount = useRef(0);
  const lastTime   = useRef(performance.now());

  useEffect(() => {
    const onMove = (e: MouseEvent) => setCoords({ x: e.clientX, y: e.clientY });
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    let rafId: number;
    const measure = (now: number) => {
      frameCount.current++;
      if (now - lastTime.current >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastTime.current = now;
      }
      rafId = requestAnimationFrame(measure);
    };
    rafId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const pad = (n: number) => String(Math.round(n)).padStart(4, '0');

  return (
    <>
      <div className={`${styles.hud} ${styles.tl}`} aria-hidden="true">
        <div>DIVINE_OS v2.0.25</div>
        <div>SYS: NOMINAL</div>
        <div className={styles.xpLabel}>XP {`${'█'.repeat(Math.round(scrollPct / 10))}${'░'.repeat(10 - Math.round(scrollPct / 10))}`}</div>
        <div className={styles.xpTrack}>
          <div className={styles.xpFill} style={{ width: `${scrollPct}%` }} />
        </div>
      </div>

      <div className={`${styles.hud} ${styles.tr}`} aria-hidden="true">
        <div>X: {pad(coords.x)} Y: {pad(coords.y)}</div>
        <div>SECTOR: {activeSection.toUpperCase()}</div>
        <div>FPS: {fps}</div>
      </div>

      <div className={`${styles.hud} ${styles.bl}`} aria-hidden="true">
        <div>LAT: 9.0765° N</div>
        <div>ABUJA, FCT // NG</div>
      </div>

      <div className={`${styles.hud} ${styles.br}`} aria-hidden="true">
        <div>NODES: 247</div>
        <div>CONNECTION: SECURE</div>
      </div>
    </>
  );
}
