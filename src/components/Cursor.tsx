// src/components/Cursor.tsx
'use client';
import { useEffect, useRef } from 'react';
import styles from './Cursor.module.css';

export function Cursor() {
  const orbRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos     = useRef({ cx: 0, cy: 0, rx: 0, ry: 0 });
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.cx = e.clientX;
      pos.current.cy = e.clientY;
    };
    document.addEventListener('mousemove', onMove);

    const tick = () => {
      const p = pos.current;
      p.rx += (p.cx - p.rx) * 0.12;
      p.ry += (p.cy - p.ry) * 0.12;

      if (orbRef.current) {
        orbRef.current.style.left = `${p.cx}px`;
        orbRef.current.style.top  = `${p.cy}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${p.rx}px`;
        ringRef.current.style.top  = `${p.ry}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const addHover    = () => document.body.classList.add('cursor-hover');
    const removeHover = () => document.body.classList.remove('cursor-hover');

    const bindHover = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });
    };
    bindHover();

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={orbRef}  className={styles.orb}  aria-hidden="true" />
      <div ref={ringRef} className={styles.ring} aria-hidden="true" />
    </>
  );
}
