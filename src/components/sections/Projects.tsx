// src/components/sections/Projects.tsx
'use client';
import { RevealWrapper } from '@/components/ui/RevealWrapper';
import { GlitchText } from '@/components/ui/GlitchText';
import { ProjectCard } from '@/components/ui/ProjectCard';
import styles from './Projects.module.css';

export function Projects() {
  return (
    <section id="projects" className={styles.section}>
      <RevealWrapper delay={0}><div className={styles.tag}>&gt; 04 // PROJECTS.DIR</div></RevealWrapper>
      <RevealWrapper delay={60}><GlitchText>PROJECTS</GlitchText></RevealWrapper>
      <RevealWrapper delay={120}>
        <div className={styles.grid}>
          <ProjectCard
            num="01 //"
            name="Stock Price Predictor"
            description="Dual-model forecasting engine — ARIMA + LSTM — pulling real-time data from Yahoo Finance API with automated ADF stationarity testing and seasonal decomposition."
            tags={['PYTHON', 'TENSORFLOW', 'LSTM', 'ARIMA', 'PANDAS', 'SEABORN']}
            githubUrl="https://github.com/jinwukongx/Stock-Price-Predictor"
          />
          <ProjectCard
            num="02 //"
            name="LOCKED"
            description=""
            tags={[]}
            locked
          />
        </div>
      </RevealWrapper>
    </section>
  );
}
