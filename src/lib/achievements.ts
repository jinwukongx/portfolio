// src/lib/achievements.ts
export interface Achievement {
  id: string;
  title: string;
  description: string;
}

export const ACHIEVEMENTS: Record<string, Achievement> = {
  enter: {
    id: 'enter',
    title: 'ACHIEVEMENT UNLOCKED',
    description: 'You entered the portfolio. The journey begins.',
  },
  about: {
    id: 'about',
    title: 'ACHIEVEMENT UNLOCKED',
    description: 'Curious, are we? You scrolled to About.',
  },
  experience: {
    id: 'experience',
    title: 'ACHIEVEMENT UNLOCKED',
    description: "You've seen my work history.",
  },
  projects: {
    id: 'projects',
    title: 'ACHIEVEMENT UNLOCKED',
    description: 'Project explorer. Nice.',
  },
  skills: {
    id: 'skills',
    title: 'ACHIEVEMENT UNLOCKED',
    description: 'You checked my stats. Respect.',
  },
  contact: {
    id: 'contact',
    title: 'ACHIEVEMENT UNLOCKED',
    description: 'Ready to connect? Bold move.',
  },
};
