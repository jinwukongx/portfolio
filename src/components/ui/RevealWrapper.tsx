// src/components/ui/RevealWrapper.tsx
'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './RevealWrapper.module.css';

interface RevealWrapperProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  onReveal?: () => void;
}

export function RevealWrapper({ children, delay = 0, className = '', onReveal }: RevealWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => {
          setVisible(true);
          onReveal?.();
        }, delay);
        observer.unobserve(el);
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, onReveal]);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.visible : ''} ${className}`}
    >
      {children}
    </div>
  );
}
