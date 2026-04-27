// src/components/sections/About.tsx
'use client';
import { RevealWrapper } from '@/components/ui/RevealWrapper';
import { GlitchText } from '@/components/ui/GlitchText';
import styles from './About.module.css';

const STATS = [
  { num: '40%', label: 'VENDOR ENGAGEMENT ↑' },
  { num: '50%', label: 'DB RETRIEVAL SPEED ↑' },
  { num: '30%', label: 'SYSTEM ERRORS ↓'      },
  { num: '3+',  label: 'YEARS EXPERIENCE'      },
];

export function About() {
  return (
    <section id="about" className={styles.section}>
      <RevealWrapper delay={0}>
        <div className={styles.tag}>&gt; 02 // ABOUT.EXE</div>
      </RevealWrapper>
      <RevealWrapper delay={60}>
        <GlitchText>ABOUT ME</GlitchText>
      </RevealWrapper>
      <RevealWrapper delay={120}>
        <div className={styles.grid}>
          <div className={styles.bio}>
            <p>I&apos;m <strong>Divine Amakor</strong> — a Full-Stack Engineer and Industrial Mathematics graduate from Covenant University, Abuja.</p>
            <p>I build <strong>fast, scalable systems</strong> with the MERN stack and bring data to life through machine learning and deep learning pipelines. When I&apos;m not writing code I&apos;m optimising it.</p>
            <p>Currently seeking opportunities where I can ship <strong>meaningful products</strong> and grow alongside driven teams.</p>
          </div>
          <div className={styles.stats}>
            {STATS.map((s) => (
              <div key={s.label} className={styles.statBox} data-cursor-hover>
                <div className={styles.statNum}>{s.num}</div>
                <div className={styles.statLabel}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </RevealWrapper>
    </section>
  );
}
