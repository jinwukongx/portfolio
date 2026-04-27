// src/components/ui/ProjectCard.tsx
import styles from './ProjectCard.module.css';

interface ProjectCardProps {
  num: string;
  name: string;
  description: string;
  tags: string[];
  githubUrl?: string;
  locked?: boolean;
}

export function ProjectCard({ num, name, description, tags, githubUrl, locked = false }: ProjectCardProps) {
  if (locked) {
    return (
      <div className={`${styles.card} ${styles.locked}`} data-cursor-hover>
        <div className={styles.num}>{num}</div>
        <div className={styles.name}>LOCKED</div>
        <div className={styles.lockedMsg}>
          &gt; ACCESS DENIED<br />
          &gt; CLEARANCE REQUIRED_
        </div>
      </div>
    );
  }

  return (
    <div className={styles.card} data-cursor-hover>
      {githubUrl && (
        <a href={githubUrl} target="_blank" rel="noopener noreferrer" className={styles.link}>
          ↗ GITHUB
        </a>
      )}
      <div className={styles.num}>{num}</div>
      <div className={styles.name}>{name}</div>
      <p className={styles.desc}>{description}</p>
      <div className={styles.tags}>
        {tags.map((tag) => <span key={tag} className={styles.tag}>{tag}</span>)}
      </div>
    </div>
  );
}
