// src/components/ui/GlitchText.tsx
import { ElementType, ReactNode } from 'react';
import styles from './GlitchText.module.css';

interface GlitchTextProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function GlitchText({ children, as: Tag = 'h2', className = '' }: GlitchTextProps) {
  const text = typeof children === 'string' ? children : undefined;
  return (
    <Tag className={`${styles.title} ${className}`}>
      <span className={styles.text}>{children}</span>
      <span className={styles.g1} aria-hidden="true" data-text={text} />
      <span className={styles.g2} aria-hidden="true" data-text={text} />
      <span className={styles.g3} aria-hidden="true" data-text={text} />
    </Tag>
  );
}
