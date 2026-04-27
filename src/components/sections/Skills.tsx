// src/components/sections/Skills.tsx
'use client';
import { useState } from 'react';
import { RevealWrapper } from '@/components/ui/RevealWrapper';
import { GlitchText } from '@/components/ui/GlitchText';
import { SkillBar } from '@/components/ui/SkillBar';
import styles from './Skills.module.css';

const SKILLS = [
  { name: 'PYTHON',     level: 88 },
  { name: 'REACT.JS',   level: 85 },
  { name: 'NODE.JS',    level: 82 },
  { name: 'TYPESCRIPT', level: 80 },
  { name: 'NEXT.JS',    level: 80 },
  { name: 'MONGODB',    level: 78 },
  { name: 'TENSORFLOW', level: 75 },
  { name: 'JAVA',       level: 70 },
];

const BADGES = ['⚡ MERN STACK', '🧠 DEEP LEARNING', '📊 DATA PIPELINES', '🔐 SYS ADMIN', '📝 TECH DOCS', '🤝 CROSS-FUNC TEAMS'];

export function Skills() {
  const [animate, setAnimate] = useState(false);

  return (
    <section id="skills" className={styles.section}>
      <RevealWrapper delay={0}><div className={styles.tag}>&gt; 05 // SKILLS.STAT</div></RevealWrapper>
      <RevealWrapper delay={60}><GlitchText>SKILLS</GlitchText></RevealWrapper>
      <RevealWrapper delay={120} onReveal={() => setAnimate(true)}>
        <div className={styles.rpgCard}>
          <div className={styles.rpgHeader}>
            <div>
              <div className={styles.rpgName}>DIVINE AMAKOR</div>
              <div className={styles.rpgClass}>CLASS: FULL-STACK ENGINEER // ML SPECIALIST</div>
            </div>
            <div className={styles.rpgLevel}>
              <span className={styles.rpgLevelNum}>42</span>
              LEVEL
            </div>
          </div>
          <div className={styles.skillGrid}>
            {SKILLS.map((s, i) => (
              <SkillBar key={s.name} name={s.name} level={s.level} animate={animate} delay={i * 90} />
            ))}
          </div>
          <div className={styles.badges}>
            {BADGES.map((b) => <div key={b} className={styles.badge} data-cursor-hover>{b}</div>)}
          </div>
        </div>
      </RevealWrapper>
    </section>
  );
}
