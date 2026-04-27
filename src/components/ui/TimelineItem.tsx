// src/components/ui/TimelineItem.tsx
import styles from './TimelineItem.module.css';

interface TimelineItemProps {
  date: string;
  role: string;
  company: string;
  bullets: string[];
}

export function TimelineItem({ date, role, company, bullets }: TimelineItemProps) {
  return (
    <div className={styles.item} data-cursor-hover>
      <div className={styles.dot} />
      <div className={styles.date}>{date}</div>
      <div className={styles.role}>{role}</div>
      <div className={styles.company}>{company}</div>
      <ul className={styles.bullets}>
        {bullets.map((b, i) => <li key={i}>{b}</li>)}
      </ul>
    </div>
  );
}
