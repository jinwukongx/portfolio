// src/components/sections/Experience.tsx
'use client';
import { RevealWrapper } from '@/components/ui/RevealWrapper';
import { GlitchText } from '@/components/ui/GlitchText';
import { TimelineItem } from '@/components/ui/TimelineItem';
import styles from './Experience.module.css';

const JOBS = [
  {
    date: 'MAR 2024 – AUG 2024',
    role: 'Software Engineering Intern',
    company: 'Baze University · Abuja, FCT',
    bullets: [
      'Led MERN stack platform dev — vendor engagement ↑ 40%',
      'React UI components — user satisfaction ↑ 25%',
      'Node.js/Express testing — system errors ↓ 30%',
      'MongoDB integration — data retrieval times ↓ 50%',
    ],
  },
  {
    date: 'SEP 2023 – NOV 2023',
    role: 'IT Support Specialist',
    company: 'Covenant University · Ota, Ogun',
    bullets: [
      'Resolved hardware, software & network issues via Python and Java',
      'Administered user accounts — strict security protocol enforcement',
      'Authored technical docs — streamlined support workflows',
    ],
  },
  {
    date: 'JAN 2023 – JUN 2023',
    role: 'Data Entry Clerk',
    company: 'Covenant University · Ota, Ogun',
    bullets: [
      'Managed high-volume biometric capture sessions',
      'Complex dataset processing — strict data accuracy via Excel',
      'Authored periodic reports and maintained organised archives',
    ],
  },
];

export function Experience() {
  return (
    <section id="experience" className={styles.section}>
      <RevealWrapper delay={0}><div className={styles.tag}>&gt; 03 // EXPERIENCE.LOG</div></RevealWrapper>
      <RevealWrapper delay={60}><GlitchText>EXPERIENCE</GlitchText></RevealWrapper>
      <RevealWrapper delay={120}>
        <div className={styles.timeline}>
          {JOBS.map((job) => <TimelineItem key={job.date} {...job} />)}
        </div>
      </RevealWrapper>
    </section>
  );
}
