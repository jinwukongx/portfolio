// src/components/sections/Hero.tsx
'use client';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import styles from './Hero.module.css';

export function Hero() {
  return (
    <section id="hero" className={styles.hero}>
      <ParticleCanvas />
      <div className={styles.content}>
        <div className={styles.tag}>&gt; PORTFOLIO.EXE <span className={styles.cursor}>_</span></div>
        <h1 className={styles.name}>
          DIVINE AMAKOR
          <span className={styles.g1} aria-hidden="true">DIVINE AMAKOR</span>
          <span className={styles.g2} aria-hidden="true">DIVINE AMAKOR</span>
        </h1>
        <div className={styles.sub}>FULL-STACK ENGINEER</div>
        <div className={styles.role}>&gt; Industrial Mathematics + Computer Science · Abuja, NG</div>
        <div className={styles.line} />
        <div className={styles.cta}>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })}
            data-cursor-hover
          >
            VIEW PROJECTS
          </button>
          <button
            className={`${styles.btn} ${styles.btnSecondary}`}
            onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
            data-cursor-hover
          >
            CONTACT.SH
          </button>
        </div>
        <div className={styles.scrollHint}>
          <div className={styles.scrollLine} />
          SCROLL TO EXPLORE
        </div>
      </div>
    </section>
  );
}
