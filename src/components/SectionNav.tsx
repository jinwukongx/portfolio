// src/components/SectionNav.tsx
'use client';
import { useState } from 'react';
import { SECTIONS } from '@/lib/sections';
import styles from './SectionNav.module.css';

interface SectionNavProps {
  activeId: string;
}

export function SectionNav({ activeId }: SectionNavProps) {
  const [hovering, setHovering] = useState(false);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <nav
      className={`${styles.nav} ${hovering ? styles.hasHover : ''}`}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      aria-label="Section navigation"
    >
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          className={`${styles.item} ${activeId === s.id ? styles.active : ''}`}
          onClick={() => scrollTo(s.id)}
          data-cursor-hover
          aria-label={`Navigate to ${s.navLabel}`}
        >
          <span className={styles.label}>{s.navLabel}</span>
          <div className={styles.dot} />
        </button>
      ))}
    </nav>
  );
}
