# Portfolio Website Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Divine Amakor's cyberpunk portfolio — a single-page Next.js 14 app with game-like features: boot screen, heavy glitch scroll reveals, RPG skills sheet, interactive particle field, custom cursor, HUD overlay, achievement toasts, and a hidden terminal easter egg.

**Architecture:** Next.js 14 App Router + TypeScript. Global game features (cursor, HUD, achievements, terminal) mount in `layout.tsx` so they persist across all sections. CSS Modules for component-scoped styles; global CSS for keyframes and base variables. All browser-API components use `'use client'` directive.

**Tech Stack:** Next.js 14, TypeScript, GSAP + @gsap/react, Framer Motion, CSS Modules, Jest + React Testing Library, Vercel.

---

## File Map

```
src/
  app/
    layout.tsx              — mounts Cursor, HUD, AchievementToast, Terminal globally
    page.tsx                — assembles all 6 sections
    globals.css             — CSS vars, scanlines, cursor:none, global @keyframes
  components/
    BootScreen.tsx / .module.css
    Cursor.tsx / .module.css
    ParticleCanvas.tsx      — canvas only, no CSS module needed
    HUD.tsx / .module.css
    SectionNav.tsx / .module.css
    AchievementToast.tsx / .module.css
    Terminal.tsx / .module.css
    sections/
      Hero.tsx / .module.css
      About.tsx / .module.css
      Experience.tsx / .module.css
      Projects.tsx / .module.css
      Skills.tsx / .module.css
      Contact.tsx / .module.css
    ui/
      GlitchText.tsx / .module.css
      RevealWrapper.tsx / .module.css
      SkillBar.tsx / .module.css
      ProjectCard.tsx / .module.css
      TimelineItem.tsx / .module.css
  hooks/
    useActiveSection.ts
    useAchievements.ts
  lib/
    achievements.ts
    parseCommand.ts
    sections.ts
  __tests__/
    parseCommand.test.ts
    useActiveSection.test.ts
    useAchievements.test.ts
    GlitchText.test.tsx
    SkillBar.test.tsx
```

---

## Task 1: Scaffold Next.js project

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.ts`, full Next.js scaffold

- [ ] **Step 1: Run create-next-app in the Portfolio directory**

```bash
cd "C:/Users/Divine/Desktop/Portfolio"
npx create-next-app@14 . --typescript --no-tailwind --eslint --app --src-dir --import-alias "@/*"
```

When prompted interactively, answer: No to Tailwind, Yes to ESLint, Yes to App Router, Yes to src/ dir.

Expected: scaffold created, `package.json` present with `next: "14.x"`.

- [ ] **Step 2: Install animation + form dependencies**

```bash
npm install gsap @gsap/react framer-motion
```

Expected: `node_modules/gsap`, `node_modules/framer-motion` present.

- [ ] **Step 3: Install testing dependencies**

```bash
npm install -D jest jest-environment-jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event ts-jest @types/jest
```

- [ ] **Step 4: Create `jest.config.ts`**

```typescript
// jest.config.ts
import type { Config } from 'jest';
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({ dir: './' });

const config: Config = {
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: [],
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.module\\.css$': '<rootDir>/__mocks__/styleMock.ts',
  },
};

export default createJestConfig(config);
```

- [ ] **Step 5: Create `jest.setup.ts`**

```typescript
// jest.setup.ts
import '@testing-library/jest-dom';
```

- [ ] **Step 6: Create CSS module mock**

```typescript
// __mocks__/styleMock.ts
const handler: ProxyHandler<object> = {
  get: (_target, prop) => String(prop),
};
export default new Proxy({}, handler);
```

- [ ] **Step 7: Add test script to `package.json`**

Open `package.json` and add to `"scripts"`:
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 8: Delete auto-generated boilerplate**

Delete: `src/app/page.tsx` content (replace with empty shell later), `src/app/globals.css` content (rewrite in Task 2).
Remove: `public/vercel.svg`, `public/next.svg`.

- [ ] **Step 9: Verify dev server starts**

```bash
npm run dev
```

Expected: `ready - started server on 0.0.0.0:3000`. Open http://localhost:3000 — blank page, no errors.

- [ ] **Step 10: Commit**

```bash
git init
git add .
git commit -m "feat: scaffold Next.js 14 with TypeScript, GSAP, Framer Motion, Jest"
```

---

## Task 2: Global CSS — variables, scanlines, keyframes

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace globals.css entirely**

```css
/* src/app/globals.css */
:root {
  --green: #00ff41;
  --green-dim: rgba(0, 255, 65, 0.4);
  --green-faint: rgba(0, 255, 65, 0.12);
  --bg: #000000;
  --font-mono: 'Courier New', Courier, monospace;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--bg);
  color: var(--green);
  font-family: var(--font-mono);
  cursor: none;
  overflow-x: hidden;
}

/* Global scanlines — sits above everything except cursor */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 9000;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 255, 65, 0.012) 2px,
    rgba(0, 255, 65, 0.012) 4px
  );
}

/* ── Global keyframes (referenced by CSS modules by name) ── */

@keyframes revealHeavy {
  0%   { opacity: 0; transform: translateY(28px) translateX(0); filter: blur(3px); clip-path: none; }
  12%  { opacity: 1; transform: translateY(-3px) translateX(0); filter: blur(0); }
  14%  { opacity: 0.2; transform: translateY(-3px) translateX(-14px); filter: blur(1px); clip-path: polygon(0 0, 100% 0, 100% 35%, 0 35%); }
  16%  { opacity: 0.9; transform: translateY(-3px) translateX(10px); filter: blur(0); clip-path: polygon(0 35%, 100% 35%, 100% 70%, 0 70%); }
  18%  { opacity: 0.4; transform: translateY(-3px) translateX(-6px); clip-path: polygon(0 70%, 100% 70%, 100% 100%, 0 100%); }
  20%  { opacity: 1; transform: translateY(-3px) translateX(0); clip-path: none; }
  26%  { opacity: 0.3; transform: translateY(-3px) translateX(18px); filter: blur(2px); clip-path: polygon(0 10%, 100% 10%, 100% 45%, 0 45%); }
  28%  { opacity: 0.8; transform: translateY(-3px) translateX(-12px); filter: blur(0); clip-path: polygon(0 45%, 100% 45%, 100% 80%, 0 80%); }
  30%  { opacity: 1; transform: translateY(-3px) translateX(0); clip-path: none; }
  42%  { opacity: 1; transform: translateY(0) translateX(0); filter: blur(0); clip-path: none; }
  100% { opacity: 1; transform: translateY(0) translateX(0); filter: blur(0); clip-path: none; }
}

@keyframes gLayer1 {
  0%   { opacity: 0; transform: translateX(0); }
  5%   { opacity: 1; transform: translateX(-16px); }
  12%  { opacity: 1; transform: translateX(12px); }
  18%  { opacity: 0.7; transform: translateX(-8px); }
  25%  { opacity: 1; transform: translateX(20px); }
  32%  { opacity: 0.4; transform: translateX(-4px); }
  40%  { opacity: 1; transform: translateX(8px); }
  50%  { opacity: 0; transform: translateX(0); }
  100% { opacity: 0; }
}

@keyframes gLayer2 {
  0%   { opacity: 0; transform: translateX(0); }
  8%   { opacity: 1; transform: translateX(18px); }
  15%  { opacity: 1; transform: translateX(-14px); }
  22%  { opacity: 0.8; transform: translateX(10px); }
  30%  { opacity: 1; transform: translateX(-20px); }
  38%  { opacity: 0.5; transform: translateX(6px); }
  45%  { opacity: 0; transform: translateX(0); }
  100% { opacity: 0; }
}

@keyframes gLayer3 {
  0%   { opacity: 0; transform: translateX(0); }
  10%  { opacity: 1; transform: translateX(-22px); }
  18%  { opacity: 0.9; transform: translateX(16px); }
  26%  { opacity: 1; transform: translateX(-10px); }
  34%  { opacity: 0.6; transform: translateX(14px); }
  42%  { opacity: 0; transform: translateX(0); }
  100% { opacity: 0; }
}

@keyframes noisePulse {
  0%   { opacity: 0.18; }
  10%  { opacity: 0.08; }
  20%  { opacity: 0.22; }
  35%  { opacity: 0.05; }
  50%  { opacity: 0.15; }
  70%  { opacity: 0.03; }
  100% { opacity: 0; }
}

@keyframes tearFlash {
  0%   { opacity: 0; top: 20%; }
  10%  { opacity: 0.8; top: 20%; }
  20%  { opacity: 0; top: 20%; }
  30%  { opacity: 0.6; top: 55%; }
  40%  { opacity: 0; top: 55%; }
  60%  { opacity: 0.4; top: 75%; }
  80%  { opacity: 0; top: 75%; }
  100% { opacity: 0; }
}

@keyframes blink {
  50% { opacity: 0; }
}

@keyframes bootLineIn {
  to { opacity: 1; }
}

@keyframes bootProgress {
  to { width: 100%; }
}

@keyframes bootFade {
  to { opacity: 0; pointer-events: none; }
}

@keyframes heroIn {
  to { opacity: 1; }
}

@keyframes nameGlitch1 {
  0%, 90%, 100% { transform: none; opacity: 0; }
  91%  { transform: translateX(-4px); opacity: 1; }
  93%  { transform: translateX(4px);  opacity: 1; }
  95%  { transform: none; opacity: 0; }
}

@keyframes nameGlitch2 {
  0%, 85%, 100% { transform: none; opacity: 0; }
  86%  { transform: translateX(6px);  opacity: 1; }
  89%  { transform: translateX(-2px); opacity: 1; }
  92%  { transform: none; opacity: 0; }
}

@keyframes scrollPulse {
  50% { width: 60px; opacity: 0.6; }
}

@keyframes toastIn {
  to { opacity: 1; transform: translateX(0); }
}

@keyframes toastOut {
  to { opacity: 0; transform: translateX(-20px); }
}

@keyframes terminalSlideUp {
  to { transform: translateY(0); }
}

@keyframes terminalSlideDown {
  to { transform: translateY(100%); }
}

@keyframes fillBar {
  to { width: var(--target-width); }
}
```

- [ ] **Step 2: Verify no compilation errors**

```bash
npm run dev
```

Expected: server starts, browser shows blank page with no console errors.

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "feat: global CSS variables, scanlines, and animation keyframes"
```

---

## Task 3: `sections.ts` and `useActiveSection` hook (TDD)

**Files:**
- Create: `src/lib/sections.ts`
- Create: `src/hooks/useActiveSection.ts`
- Create: `src/__tests__/useActiveSection.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// src/__tests__/useActiveSection.test.ts
import { renderHook, act } from '@testing-library/react';
import { useActiveSection } from '@/hooks/useActiveSection';

const mockObserve = jest.fn();
const mockUnobserve = jest.fn();
const mockDisconnect = jest.fn();
let observerCallback: IntersectionObserverCallback;

beforeEach(() => {
  window.IntersectionObserver = jest.fn((cb) => {
    observerCallback = cb;
    return { observe: mockObserve, unobserve: mockUnobserve, disconnect: mockDisconnect };
  }) as unknown as typeof IntersectionObserver;

  document.body.innerHTML = `
    <section id="hero"></section>
    <section id="about"></section>
    <section id="skills"></section>
  `;
});

afterEach(() => jest.clearAllMocks());

test('returns first section id as default', () => {
  const { result } = renderHook(() =>
    useActiveSection(['hero', 'about', 'skills'])
  );
  expect(result.current).toBe('hero');
});

test('updates active id when a section intersects', () => {
  const { result } = renderHook(() =>
    useActiveSection(['hero', 'about', 'skills'])
  );
  act(() => {
    observerCallback(
      [{ isIntersecting: true, target: document.getElementById('about')! }] as IntersectionObserverEntry[],
      {} as IntersectionObserver
    );
  });
  expect(result.current).toBe('about');
});

test('does not update when entry is not intersecting', () => {
  const { result } = renderHook(() =>
    useActiveSection(['hero', 'about', 'skills'])
  );
  act(() => {
    observerCallback(
      [{ isIntersecting: false, target: document.getElementById('about')! }] as IntersectionObserverEntry[],
      {} as IntersectionObserver
    );
  });
  expect(result.current).toBe('hero');
});

test('disconnects observer on unmount', () => {
  const { unmount } = renderHook(() =>
    useActiveSection(['hero', 'about', 'skills'])
  );
  unmount();
  expect(mockDisconnect).toHaveBeenCalledTimes(1);
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test -- --testPathPattern=useActiveSection
```

Expected: FAIL — `Cannot find module '@/hooks/useActiveSection'`

- [ ] **Step 3: Create `src/lib/sections.ts`**

```typescript
// src/lib/sections.ts
export interface SectionMeta {
  id: string;
  label: string;
  navLabel: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: 'hero',       label: '01 // HERO',       navLabel: 'HOME'       },
  { id: 'about',      label: '02 // ABOUT.EXE',  navLabel: 'ABOUT'      },
  { id: 'experience', label: '03 // EXPERIENCE.LOG', navLabel: 'EXPERIENCE' },
  { id: 'projects',   label: '04 // PROJECTS.DIR',   navLabel: 'PROJECTS'   },
  { id: 'skills',     label: '05 // SKILLS.STAT',    navLabel: 'SKILLS'     },
  { id: 'contact',    label: '06 // CONTACT.SH',     navLabel: 'CONTACT'    },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);
```

- [ ] **Step 4: Create `src/hooks/useActiveSection.ts`**

```typescript
// src/hooks/useActiveSection.ts
'use client';
import { useEffect, useRef, useState } from 'react';

export function useActiveSection(sectionIds: string[]): string {
  const [activeId, setActiveId] = useState(sectionIds[0]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveId(entry.target.id);
        });
      },
      { threshold: 0.4 }
    );

    sectionIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return activeId;
}
```

- [ ] **Step 5: Run test — expect pass**

```bash
npm test -- --testPathPattern=useActiveSection
```

Expected: PASS — 4 tests

- [ ] **Step 6: Commit**

```bash
git add src/lib/sections.ts src/hooks/useActiveSection.ts src/__tests__/useActiveSection.test.ts
git commit -m "feat: section metadata and useActiveSection hook"
```

---

## Task 4: `achievements.ts` and `useAchievements` hook (TDD)

**Files:**
- Create: `src/lib/achievements.ts`
- Create: `src/hooks/useAchievements.ts`
- Create: `src/__tests__/useAchievements.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// src/__tests__/useAchievements.test.ts
import { renderHook, act } from '@testing-library/react';
import { useAchievements } from '@/hooks/useAchievements';

test('starts with empty queue', () => {
  const { result } = renderHook(() => useAchievements());
  expect(result.current.queue).toHaveLength(0);
});

test('trigger adds achievement to queue', () => {
  const { result } = renderHook(() => useAchievements());
  act(() => { result.current.trigger('enter'); });
  expect(result.current.queue).toHaveLength(1);
  expect(result.current.queue[0].id).toBe('enter');
});

test('does not trigger same achievement twice', () => {
  const { result } = renderHook(() => useAchievements());
  act(() => { result.current.trigger('enter'); });
  act(() => { result.current.trigger('enter'); });
  expect(result.current.queue).toHaveLength(1);
});

test('dismiss removes achievement from queue', () => {
  const { result } = renderHook(() => useAchievements());
  act(() => { result.current.trigger('enter'); });
  act(() => { result.current.dismiss('enter'); });
  expect(result.current.queue).toHaveLength(0);
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test -- --testPathPattern=useAchievements
```

Expected: FAIL — `Cannot find module '@/hooks/useAchievements'`

- [ ] **Step 3: Create `src/lib/achievements.ts`**

```typescript
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
```

- [ ] **Step 4: Create `src/hooks/useAchievements.ts`**

```typescript
// src/hooks/useAchievements.ts
'use client';
import { useCallback, useRef, useState } from 'react';
import { Achievement, ACHIEVEMENTS } from '@/lib/achievements';

export function useAchievements() {
  const [queue, setQueue] = useState<Achievement[]>([]);
  const triggered = useRef<Set<string>>(new Set());

  const trigger = useCallback((id: string) => {
    if (triggered.current.has(id)) return;
    const achievement = ACHIEVEMENTS[id];
    if (!achievement) return;
    triggered.current.add(id);
    setQueue((prev) => [...prev, achievement]);
  }, []);

  const dismiss = useCallback((id: string) => {
    setQueue((prev) => prev.filter((a) => a.id !== id));
  }, []);

  return { queue, trigger, dismiss };
}
```

- [ ] **Step 5: Run test — expect pass**

```bash
npm test -- --testPathPattern=useAchievements
```

Expected: PASS — 4 tests

- [ ] **Step 6: Commit**

```bash
git add src/lib/achievements.ts src/hooks/useAchievements.ts src/__tests__/useAchievements.test.ts
git commit -m "feat: achievement definitions and useAchievements hook"
```

---

## Task 5: `parseCommand.ts` for terminal easter egg (TDD)

**Files:**
- Create: `src/lib/parseCommand.ts`
- Create: `src/__tests__/parseCommand.test.ts`

- [ ] **Step 1: Write failing test**

```typescript
// src/__tests__/parseCommand.test.ts
import { parseCommand } from '@/lib/parseCommand';

test('whoami returns text with bio', () => {
  const r = parseCommand('whoami');
  expect(r.type).toBe('text');
  if (r.type === 'text') expect(r.content).toContain('Divine Amakor');
});

test('ls projects returns project list', () => {
  const r = parseCommand('ls projects');
  expect(r.type).toBe('text');
  if (r.type === 'text') expect(r.content).toContain('Stock Price Predictor');
});

test('ls skills returns skill list', () => {
  const r = parseCommand('ls skills');
  expect(r.type).toBe('text');
  if (r.type === 'text') expect(r.content).toContain('Python');
});

test('contact returns scroll action', () => {
  const r = parseCommand('contact');
  expect(r).toEqual({ type: 'scroll', sectionId: 'contact' });
});

test('clear returns clear action', () => {
  expect(parseCommand('clear')).toEqual({ type: 'clear' });
});

test('exit returns close action', () => {
  expect(parseCommand('exit')).toEqual({ type: 'close' });
  expect(parseCommand('close')).toEqual({ type: 'close' });
});

test('help returns text with command list', () => {
  const r = parseCommand('help');
  expect(r.type).toBe('text');
  if (r.type === 'text') expect(r.content).toContain('whoami');
});

test('unknown command returns unknown type with input echoed', () => {
  const r = parseCommand('foobar');
  expect(r).toEqual({ type: 'unknown', input: 'foobar' });
});

test('is case-insensitive', () => {
  expect(parseCommand('WHOAMI').type).toBe('text');
  expect(parseCommand('EXIT')).toEqual({ type: 'close' });
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test -- --testPathPattern=parseCommand
```

Expected: FAIL

- [ ] **Step 3: Create `src/lib/parseCommand.ts`**

```typescript
// src/lib/parseCommand.ts
export type CommandResult =
  | { type: 'text'; content: string }
  | { type: 'scroll'; sectionId: string }
  | { type: 'clear' }
  | { type: 'close' }
  | { type: 'unknown'; input: string };

export function parseCommand(input: string): CommandResult {
  const cmd = input.trim().toLowerCase();

  switch (cmd) {
    case 'whoami':
      return {
        type: 'text',
        content:
          'Divine Amakor — Full-Stack Engineer\n' +
          'Industrial Mathematics & CS | Covenant University\n' +
          'Abuja, Nigeria\n' +
          'amakorchiemela@gmail.com',
      };

    case 'ls projects':
      return {
        type: 'text',
        content:
          '01. Stock Price Predictor\n' +
          '    → github.com/jinwukongx/Stock-Price-Predictor\n' +
          '02. [LOCKED] — clearance level insufficient',
      };

    case 'ls skills':
      return {
        type: 'text',
        content:
          'Python (88) | React.js (85) | Node.js (82) | TypeScript (80)\n' +
          'Next.js (80) | MongoDB (78) | TensorFlow (75) | Java (70)',
      };

    case 'contact':
      return { type: 'scroll', sectionId: 'contact' };

    case 'clear':
      return { type: 'clear' };

    case 'help':
      return {
        type: 'text',
        content:
          'Available commands:\n' +
          '  whoami      — display bio\n' +
          '  ls projects — list projects\n' +
          '  ls skills   — show skill levels\n' +
          '  contact     — navigate to contact section\n' +
          '  clear       — clear terminal output\n' +
          '  exit/close  — dismiss terminal',
      };

    case 'exit':
    case 'close':
      return { type: 'close' };

    default:
      return { type: 'unknown', input: cmd };
  }
}
```

- [ ] **Step 4: Run test — expect pass**

```bash
npm test -- --testPathPattern=parseCommand
```

Expected: PASS — 9 tests

- [ ] **Step 5: Commit**

```bash
git add src/lib/parseCommand.ts src/__tests__/parseCommand.test.ts
git commit -m "feat: terminal command parser with full test coverage"
```

---

## Task 6: `GlitchText` UI component (TDD)

**Files:**
- Create: `src/components/ui/GlitchText.tsx`
- Create: `src/components/ui/GlitchText.module.css`
- Create: `src/__tests__/GlitchText.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/__tests__/GlitchText.test.tsx
import { render, screen } from '@testing-library/react';
import { GlitchText } from '@/components/ui/GlitchText';

test('renders children text', () => {
  render(<GlitchText>ABOUT ME</GlitchText>);
  expect(screen.getByText('ABOUT ME')).toBeInTheDocument();
});

test('renders three glitch layer spans', () => {
  const { container } = render(<GlitchText>SKILLS</GlitchText>);
  const spans = container.querySelectorAll('span[aria-hidden]');
  expect(spans).toHaveLength(3);
});

test('renders as h2 by default', () => {
  const { container } = render(<GlitchText>TEST</GlitchText>);
  expect(container.querySelector('h2')).toBeInTheDocument();
});

test('renders as specified tag via as prop', () => {
  const { container } = render(<GlitchText as="h3">TEST</GlitchText>);
  expect(container.querySelector('h3')).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test -- --testPathPattern=GlitchText
```

- [ ] **Step 3: Create `src/components/ui/GlitchText.tsx`**

```tsx
// src/components/ui/GlitchText.tsx
import { ElementType, ReactNode } from 'react';
import styles from './GlitchText.module.css';

interface GlitchTextProps {
  children: ReactNode;
  as?: ElementType;
  className?: string;
}

export function GlitchText({ children, as: Tag = 'h2', className = '' }: GlitchTextProps) {
  return (
    <Tag className={`${styles.title} ${className}`}>
      {children}
      <span className={styles.g1} aria-hidden>{children}</span>
      <span className={styles.g2} aria-hidden>{children}</span>
      <span className={styles.g3} aria-hidden>{children}</span>
    </Tag>
  );
}
```

- [ ] **Step 4: Create `src/components/ui/GlitchText.module.css`**

```css
/* src/components/ui/GlitchText.module.css */
.title {
  font-size: clamp(32px, 5vw, 56px);
  font-weight: 900;
  color: var(--green);
  letter-spacing: -1px;
  text-shadow: 0 0 30px rgba(0, 255, 65, 0.4);
  margin-bottom: 48px;
  position: relative;
  display: inline-block;
  white-space: nowrap;
}

.g1, .g2, .g3 {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
  opacity: 0;
}

.g1 { color: #00ff41; clip-path: polygon(0 0,   100% 0,   100% 28%, 0 28%); }
.g2 { color: #ffffff; clip-path: polygon(0 28%,  100% 28%,  100% 55%, 0 55%); }
.g3 { color: #00ffff; clip-path: polygon(0 55%,  100% 55%,  100% 80%, 0 80%); }

/* Glitch fires when parent section gets .glitching class via JS */
:global(.glitching) .g1 { animation: gLayer1 0.7s steps(1) forwards; }
:global(.glitching) .g2 { animation: gLayer2 0.7s steps(1) forwards; }
:global(.glitching) .g3 { animation: gLayer3 0.7s steps(1) forwards; }
```

- [ ] **Step 5: Run test — expect pass**

```bash
npm test -- --testPathPattern=GlitchText
```

Expected: PASS — 4 tests

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/GlitchText.tsx src/components/ui/GlitchText.module.css src/__tests__/GlitchText.test.tsx
git commit -m "feat: GlitchText reusable component with three-layer RGB glitch"
```

---

## Task 7: `RevealWrapper` scroll reveal component

**Files:**
- Create: `src/components/ui/RevealWrapper.tsx`
- Create: `src/components/ui/RevealWrapper.module.css`

- [ ] **Step 1: Create `src/components/ui/RevealWrapper.tsx`**

```tsx
// src/components/ui/RevealWrapper.tsx
'use client';
import { ReactNode, useEffect, useRef, useState } from 'react';
import styles from './RevealWrapper.module.css';

interface RevealWrapperProps {
  children: ReactNode;
  delay?: number;  /** ms delay before animation fires, for stagger */
  className?: string;
  onReveal?: () => void; /** callback when element enters view */
}

export function RevealWrapper({ children, delay = 0, className = '', onReveal }: RevealWrapperProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        setTimeout(() => {
          setVisible(true);
          onReveal?.();
        }, delay);
        observer.unobserve(el);
      },
      { threshold: 0.12 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay, onReveal]);

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${visible ? styles.visible : ''} ${className}`}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/ui/RevealWrapper.module.css`**

```css
/* src/components/ui/RevealWrapper.module.css */
.reveal {
  opacity: 0;
  transform: translateY(28px);
  filter: blur(3px);
}

.visible {
  animation: revealHeavy 0.8s steps(1) forwards;
}
```

- [ ] **Step 3: Verify renders in dev (no test — purely visual)**

Add temporarily to `src/app/page.tsx`:
```tsx
import { RevealWrapper } from '@/components/ui/RevealWrapper';
export default function Home() {
  return (
    <main style={{ height: '200vh', padding: '100px 80px', color: '#00ff41', fontFamily: 'monospace' }}>
      <div style={{ marginBottom: '120vh' }}>Scroll down</div>
      <RevealWrapper><h2>REVEAL TEST</h2></RevealWrapper>
    </main>
  );
}
```

Run `npm run dev` → scroll down → heading should slam in with glitch. Revert `page.tsx` after confirming.

- [ ] **Step 4: Commit**

```bash
git add src/components/ui/RevealWrapper.tsx src/components/ui/RevealWrapper.module.css
git commit -m "feat: RevealWrapper with heavy glitch scroll reveal animation"
```

---

## Task 8: `SkillBar` component (TDD)

**Files:**
- Create: `src/components/ui/SkillBar.tsx`
- Create: `src/components/ui/SkillBar.module.css`
- Create: `src/__tests__/SkillBar.test.tsx`

- [ ] **Step 1: Write failing test**

```tsx
// src/__tests__/SkillBar.test.tsx
import { render, screen } from '@testing-library/react';
import { SkillBar } from '@/components/ui/SkillBar';

test('renders skill name and level', () => {
  render(<SkillBar name="PYTHON" level={88} animate={false} />);
  expect(screen.getByText('PYTHON')).toBeInTheDocument();
  expect(screen.getByText('LVL 88')).toBeInTheDocument();
});

test('fill bar has correct aria label', () => {
  render(<SkillBar name="REACT" level={85} animate={false} />);
  expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '85');
});
```

- [ ] **Step 2: Run test — expect failure**

```bash
npm test -- --testPathPattern=SkillBar
```

- [ ] **Step 3: Create `src/components/ui/SkillBar.tsx`**

```tsx
// src/components/ui/SkillBar.tsx
'use client';
import { useEffect, useRef } from 'react';
import styles from './SkillBar.module.css';

interface SkillBarProps {
  name: string;
  level: number; /** 0-100 */
  animate: boolean;
  delay?: number; /** ms stagger delay */
}

export function SkillBar({ name, level, animate, delay = 0 }: SkillBarProps) {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!animate || !fillRef.current) return;
    const timeout = setTimeout(() => {
      if (fillRef.current) {
        fillRef.current.style.setProperty('--target-width', `${level}%`);
        fillRef.current.classList.add(styles.animating);
      }
    }, delay);
    return () => clearTimeout(timeout);
  }, [animate, level, delay]);

  return (
    <div className={styles.item}>
      <div className={styles.header}>
        <span className={styles.name}>{name}</span>
        <span className={styles.lvl}>LVL {level}</span>
      </div>
      <div
        className={styles.track}
        role="progressbar"
        aria-valuenow={level}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${name} skill level ${level}`}
      >
        <div ref={fillRef} className={styles.fill} />
      </div>
    </div>
  );
}
```

- [ ] **Step 4: Create `src/components/ui/SkillBar.module.css`**

```css
/* src/components/ui/SkillBar.module.css */
.item { display: flex; flex-direction: column; gap: 6px; }

.header { display: flex; justify-content: space-between; }

.name { font-size: 11px; letter-spacing: 2px; color: rgba(0, 255, 65, 0.7); }

.lvl { font-size: 11px; color: var(--green); }

.track {
  height: 4px;
  background: rgba(0, 255, 65, 0.1);
  overflow: hidden;
  position: relative;
}

.fill {
  height: 100%;
  width: 0;
  background: var(--green);
  box-shadow: 0 0 6px var(--green);
  position: relative;
  --target-width: 0%;
}

.fill::after {
  content: '';
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 4px;
  background: #fff;
  opacity: 0.8;
}

.fill.animating {
  animation: fillBar 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
```

- [ ] **Step 5: Run test — expect pass**

```bash
npm test -- --testPathPattern=SkillBar
```

Expected: PASS — 2 tests

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/SkillBar.tsx src/components/ui/SkillBar.module.css src/__tests__/SkillBar.test.tsx
git commit -m "feat: SkillBar RPG-style animated progress bar"
```

---

## Task 9: `ProjectCard` and `TimelineItem` UI components

**Files:**
- Create: `src/components/ui/ProjectCard.tsx` / `.module.css`
- Create: `src/components/ui/TimelineItem.tsx` / `.module.css`

- [ ] **Step 1: Create `src/components/ui/ProjectCard.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `src/components/ui/ProjectCard.module.css`**

```css
/* src/components/ui/ProjectCard.module.css */
.card {
  border: 1px solid rgba(0, 255, 65, 0.2);
  background: rgba(0, 255, 65, 0.04);
  padding: 28px;
  position: relative;
  overflow: hidden;
  transition: border-color 0.3s, background 0.3s, transform 0.3s;
  cursor: none;
}

.card::after {
  content: '';
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 2px;
  background: linear-gradient(90deg, var(--green), transparent);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 0.3s;
}

.card:hover { border-color: rgba(0, 255, 65, 0.6); background: rgba(0, 255, 65, 0.08); transform: translateY(-4px); }
.card:hover::after { transform: scaleX(1); }

.locked { border-style: dashed; opacity: 0.45; }
.locked:hover { transform: none; }

.link {
  position: absolute;
  top: 24px; right: 24px;
  font-size: 10px;
  color: rgba(0, 255, 65, 0.3);
  letter-spacing: 2px;
  text-decoration: none;
  transition: color 0.2s;
}

.card:hover .link { color: var(--green); }

.num { font-size: 10px; color: rgba(0, 255, 65, 0.3); letter-spacing: 3px; margin-bottom: 12px; }

.name { font-size: 22px; font-weight: 700; color: var(--green); margin-bottom: 8px; }

.desc { font-size: 13px; color: rgba(0, 255, 65, 0.55); line-height: 1.7; margin-bottom: 20px; }

.lockedMsg { font-size: 11px; letter-spacing: 2px; color: rgba(0, 255, 65, 0.3); line-height: 1.8; }

.tags { display: flex; flex-wrap: wrap; gap: 8px; }

.tag {
  font-size: 9px; letter-spacing: 2px;
  padding: 4px 10px;
  border: 1px solid rgba(0, 255, 65, 0.25);
  color: rgba(0, 255, 65, 0.5);
}
```

- [ ] **Step 3: Create `src/components/ui/TimelineItem.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `src/components/ui/TimelineItem.module.css`**

```css
/* src/components/ui/TimelineItem.module.css */
.item {
  position: relative;
  margin-bottom: 48px;
  padding-left: 40px;
}

.dot {
  position: absolute;
  left: -5px;
  top: 6px;
  width: 10px; height: 10px;
  border-radius: 50%;
  background: var(--bg);
  border: 2px solid var(--green);
  box-shadow: 0 0 10px rgba(0, 255, 65, 0.5);
  transition: box-shadow 0.2s, background 0.2s;
}

.item:hover .dot { background: var(--green); box-shadow: 0 0 18px rgba(0, 255, 65, 0.8); }

.date { font-size: 10px; color: rgba(0, 255, 65, 0.4); letter-spacing: 3px; margin-bottom: 6px; }

.role { font-size: 20px; font-weight: 700; color: var(--green); margin-bottom: 2px; }

.company {
  font-size: 12px; color: rgba(0, 255, 65, 0.5);
  letter-spacing: 2px; margin-bottom: 14px;
  display: flex; align-items: center; gap: 8px;
}

.company::before { content: '▸'; color: var(--green); }

.bullets { list-style: none; }

.bullets li {
  font-size: 13px; color: rgba(0, 255, 65, 0.6);
  line-height: 1.7; padding-left: 16px; position: relative;
}

.bullets li::before { content: '·'; position: absolute; left: 0; color: var(--green); }
```

- [ ] **Step 5: Commit**

```bash
git add src/components/ui/ProjectCard.tsx src/components/ui/ProjectCard.module.css src/components/ui/TimelineItem.tsx src/components/ui/TimelineItem.module.css
git commit -m "feat: ProjectCard and TimelineItem UI components"
```

---

## Task 10: `BootScreen` component

**Files:**
- Create: `src/components/BootScreen.tsx`
- Create: `src/components/BootScreen.module.css`

- [ ] **Step 1: Create `src/components/BootScreen.tsx`**

```tsx
// src/components/BootScreen.tsx
'use client';
import { useEffect, useState } from 'react';
import styles from './BootScreen.module.css';

const BOOT_LINES = [
  'DIVINE_OS v2.0.25 — KERNEL BOOT SEQUENCE INITIATED',
  '[ OK ] Loading neural interface........................',
  '[ OK ] Mounting project archives.......................',
  '[ OK ] Initialising MERN stack modules.................',
  '[ OK ] Syncing portfolio data..........................',
  '[ WARN ] Exceptional skills detected — proceed with caution',
  '[ OK ] All systems nominal. Welcome.',
  'LOADING DIVINE.EXE ████████████████ 100%',
];

interface BootScreenProps {
  onComplete: () => void;
}

export function BootScreen({ onComplete }: BootScreenProps) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setVisibleLines(i);
      if (i >= BOOT_LINES.length) {
        clearInterval(interval);
        setTimeout(() => {
          setDone(true);
          setTimeout(onComplete, 400);
        }, 800);
      }
    }, 300);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className={`${styles.boot} ${done ? styles.done : ''}`}>
      {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
        <div
          key={i}
          className={`${styles.line} ${i === 5 ? styles.warn : ''} ${i === 7 ? styles.final : ''}`}
        >
          {line}
        </div>
      ))}
      {visibleLines >= BOOT_LINES.length && (
        <div className={styles.progressWrap}>
          <div className={styles.progressFill} />
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/BootScreen.module.css`**

```css
/* src/components/BootScreen.module.css */
.boot {
  position: fixed;
  inset: 0;
  background: #000;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding: 60px;
  transition: opacity 0.4s ease;
}

.done { opacity: 0; pointer-events: none; }

.line {
  font-size: 13px;
  color: var(--green);
  letter-spacing: 1px;
  line-height: 1.8;
  animation: bootLineIn 0.1s ease forwards;
}

.warn { color: rgba(0, 255, 65, 0.5); }

.final { color: #fff; font-size: 15px; letter-spacing: 3px; }

.progressWrap {
  margin-top: 20px;
  width: 340px;
  height: 2px;
  background: rgba(0, 255, 65, 0.15);
  overflow: hidden;
}

.progressFill {
  height: 100%;
  width: 0;
  background: var(--green);
  box-shadow: 0 0 8px var(--green);
  animation: bootProgress 1s ease forwards;
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/BootScreen.tsx src/components/BootScreen.module.css
git commit -m "feat: BootScreen terminal loading sequence"
```

---

## Task 11: `Cursor` component

**Files:**
- Create: `src/components/Cursor.tsx`
- Create: `src/components/Cursor.module.css`

- [ ] **Step 1: Create `src/components/Cursor.tsx`**

```tsx
// src/components/Cursor.tsx
'use client';
import { useEffect, useRef } from 'react';
import styles from './Cursor.module.css';

export function Cursor() {
  const orbRef  = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pos     = useRef({ cx: 0, cy: 0, rx: 0, ry: 0 });
  const rafRef  = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current.cx = e.clientX;
      pos.current.cy = e.clientY;
    };
    document.addEventListener('mousemove', onMove);

    const tick = () => {
      const p = pos.current;
      p.rx += (p.cx - p.rx) * 0.12;
      p.ry += (p.cy - p.ry) * 0.12;

      if (orbRef.current) {
        orbRef.current.style.left = `${p.cx}px`;
        orbRef.current.style.top  = `${p.cy}px`;
      }
      if (ringRef.current) {
        ringRef.current.style.left = `${p.rx}px`;
        ringRef.current.style.top  = `${p.ry}px`;
      }
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    const addHover    = () => document.body.classList.add('cursor-hover');
    const removeHover = () => document.body.classList.remove('cursor-hover');

    const bindHover = () => {
      document.querySelectorAll('a, button, [data-cursor-hover]').forEach((el) => {
        el.addEventListener('mouseenter', addHover);
        el.addEventListener('mouseleave', removeHover);
      });
    };
    bindHover();

    return () => {
      document.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <>
      <div ref={orbRef}  className={styles.orb}  aria-hidden />
      <div ref={ringRef} className={styles.ring} aria-hidden />
    </>
  );
}
```

- [ ] **Step 2: Create `src/components/Cursor.module.css`**

```css
/* src/components/Cursor.module.css */
.orb {
  position: fixed;
  width: 12px; height: 12px;
  border-radius: 50%;
  background: #00ff41;
  box-shadow: 0 0 10px #00ff41, 0 0 24px rgba(0, 255, 65, 0.5);
  pointer-events: none;
  z-index: 99999;
  transform: translate(-50%, -50%);
  transition: width 0.15s, height 0.15s, background 0.15s, border 0.15s;
}

.ring {
  position: fixed;
  width: 38px; height: 38px;
  border-radius: 50%;
  border: 1px solid rgba(0, 255, 65, 0.45);
  pointer-events: none;
  z-index: 99998;
  transform: translate(-50%, -50%);
  transition: width 0.15s, height 0.15s, border-color 0.15s;
}

:global(body.cursor-hover) .orb {
  width: 20px; height: 20px;
  background: transparent;
  border: 2px solid #00ff41;
}

:global(body.cursor-hover) .ring {
  width: 52px; height: 52px;
  border-color: rgba(0, 255, 65, 0.25);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Cursor.tsx src/components/Cursor.module.css
git commit -m "feat: global custom cursor with lagging ring and hover expansion"
```

---

## Task 12: `SectionNav` component

**Files:**
- Create: `src/components/SectionNav.tsx`
- Create: `src/components/SectionNav.module.css`

- [ ] **Step 1: Create `src/components/SectionNav.tsx`**

```tsx
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
```

- [ ] **Step 2: Create `src/components/SectionNav.module.css`**

```css
/* src/components/SectionNav.module.css */
.nav {
  position: fixed;
  right: 32px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 200;
  display: flex;
  flex-direction: column;
  gap: 6px;
  align-items: flex-end;
}

.item {
  display: flex;
  align-items: center;
  gap: 10px;
  background: none;
  border: none;
  cursor: none;
  padding: 6px 0;
}

.label {
  font-family: var(--font-mono);
  font-size: 12px;
  letter-spacing: 3px;
  color: rgba(0, 255, 65, 0.35);
  text-transform: uppercase;
  white-space: nowrap;
  transition:
    font-size     0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
    color         0.25s ease,
    text-shadow   0.25s ease,
    letter-spacing 0.25s ease,
    transform     0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
  transform-origin: right center;
}

.dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  border: 1px solid rgba(0, 255, 65, 0.3);
  flex-shrink: 0;
  transition:
    background   0.25s ease,
    border-color 0.25s ease,
    box-shadow   0.25s ease,
    transform    0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}

/* Active section */
.active .dot {
  background: var(--green);
  border-color: var(--green);
  box-shadow: 0 0 8px var(--green), 0 0 16px rgba(0, 255, 65, 0.4);
}

.active .label {
  color: var(--green);
  font-size: 13px;
  text-shadow: 0 0 8px rgba(0, 255, 65, 0.6);
}

/* Hover — pop */
.item:hover .label {
  font-size: 16px;
  color: var(--green);
  letter-spacing: 4px;
  text-shadow: 0 0 12px rgba(0, 255, 65, 0.8), 0 0 24px rgba(0, 255, 65, 0.3);
  transform: translateX(-6px);
}

.item:hover .dot {
  background: var(--green);
  border-color: var(--green);
  box-shadow: 0 0 10px var(--green), 0 0 20px rgba(0, 255, 65, 0.5);
  transform: scale(1.4);
}

/* Siblings dim while one is hovered */
.hasHover .item:not(:hover) .label {
  color: rgba(0, 255, 65, 0.2);
}

/* Responsive: hide labels on tablet, keep dots */
@media (max-width: 1023px) {
  .label { display: none; }
  .item { gap: 0; }
}

@media (max-width: 767px) {
  .nav { display: none; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/SectionNav.tsx src/components/SectionNav.module.css
git commit -m "feat: SectionNav with spring-bounce hover and sibling dimming"
```

---

## Task 13: `HUD` component

**Files:**
- Create: `src/components/HUD.tsx`
- Create: `src/components/HUD.module.css`

- [ ] **Step 1: Create `src/components/HUD.tsx`**

```tsx
// src/components/HUD.tsx
'use client';
import { useEffect, useRef, useState } from 'react';
import styles from './HUD.module.css';

interface HUDProps {
  activeSection: string;
  scrollPct: number; /** 0-100 */
}

export function HUD({ activeSection, scrollPct }: HUDProps) {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [fps, setFps]       = useState(60);
  const frameCount = useRef(0);
  const lastTime   = useRef(performance.now());

  useEffect(() => {
    const onMove = (e: MouseEvent) => setCoords({ x: e.clientX, y: e.clientY });
    document.addEventListener('mousemove', onMove);
    return () => document.removeEventListener('mousemove', onMove);
  }, []);

  useEffect(() => {
    let rafId: number;
    const measure = (now: number) => {
      frameCount.current++;
      if (now - lastTime.current >= 1000) {
        setFps(frameCount.current);
        frameCount.current = 0;
        lastTime.current = now;
      }
      rafId = requestAnimationFrame(measure);
    };
    rafId = requestAnimationFrame(measure);
    return () => cancelAnimationFrame(rafId);
  }, []);

  const pad = (n: number) => String(Math.round(n)).padStart(4, '0');

  return (
    <>
      <div className={`${styles.hud} ${styles.tl}`} aria-hidden>
        <div>DIVINE_OS v2.0.25</div>
        <div>SYS: NOMINAL</div>
        <div className={styles.xpLabel}>XP {`${'█'.repeat(Math.round(scrollPct / 10))}${'░'.repeat(10 - Math.round(scrollPct / 10))}`}</div>
        <div className={styles.xpTrack}>
          <div className={styles.xpFill} style={{ width: `${scrollPct}%` }} />
        </div>
      </div>

      <div className={`${styles.hud} ${styles.tr}`} aria-hidden>
        <div>X: {pad(coords.x)} Y: {pad(coords.y)}</div>
        <div>SECTOR: {activeSection.toUpperCase()}</div>
        <div>FPS: {fps}</div>
      </div>

      <div className={`${styles.hud} ${styles.bl}`} aria-hidden>
        <div>LAT: 9.0765° N</div>
        <div>ABUJA, FCT // NG</div>
      </div>

      <div className={`${styles.hud} ${styles.br}`} aria-hidden>
        <div>NODES: 247</div>
        <div>CONNECTION: SECURE</div>
      </div>
    </>
  );
}
```

- [ ] **Step 2: Create `src/components/HUD.module.css`**

```css
/* src/components/HUD.module.css */
.hud {
  position: fixed;
  z-index: 150;
  pointer-events: none;
  font-size: 10px;
  color: rgba(0, 255, 65, 0.5);
  letter-spacing: 2px;
  line-height: 1.8;
  font-family: var(--font-mono);
}

.tl { top: 24px; left: 24px; }
.tr { top: 24px; right: 24px; text-align: right; }
.bl { bottom: 24px; left: 24px; }
.br { bottom: 24px; right: 24px; text-align: right; }

.xpLabel { margin-top: 4px; }

.xpTrack {
  width: 120px;
  height: 2px;
  background: rgba(0, 255, 65, 0.15);
  margin-top: 4px;
  overflow: hidden;
}

.xpFill {
  height: 100%;
  background: var(--green);
  box-shadow: 0 0 4px var(--green);
  transition: width 0.3s ease;
}

@media (max-width: 767px) {
  .hud { display: none; }
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/HUD.tsx src/components/HUD.module.css
git commit -m "feat: HUD overlay with live coords, FPS counter, and XP bar"
```

---

## Task 14: `AchievementToast` component

**Files:**
- Create: `src/components/AchievementToast.tsx`
- Create: `src/components/AchievementToast.module.css`

- [ ] **Step 1: Create `src/components/AchievementToast.tsx`**

```tsx
// src/components/AchievementToast.tsx
'use client';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Achievement } from '@/lib/achievements';
import styles from './AchievementToast.module.css';

interface AchievementToastProps {
  queue: Achievement[];
  onDismiss: (id: string) => void;
}

export function AchievementToast({ queue, onDismiss }: AchievementToastProps) {
  const current = queue[0];

  useEffect(() => {
    if (!current) return;
    const timer = setTimeout(() => onDismiss(current.id), 3500);
    return () => clearTimeout(timer);
  }, [current, onDismiss]);

  return (
    <div className={styles.container} aria-live="polite">
      <AnimatePresence mode="wait">
        {current && (
          <motion.div
            key={current.id}
            className={styles.toast}
            initial={{ opacity: 0, x: -24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.35, ease: 'easeOut' }}
          >
            <span className={styles.icon}>🏆</span>
            <div>
              <div className={styles.title}>{current.title}</div>
              <div className={styles.desc}>{current.description}</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
```

- [ ] **Step 2: Create `src/components/AchievementToast.module.css`**

```css
/* src/components/AchievementToast.module.css */
.container {
  position: fixed;
  bottom: 80px;
  left: 24px;
  z-index: 500;
  pointer-events: none;
}

.toast {
  background: rgba(0, 10, 0, 0.95);
  border: 1px solid rgba(0, 255, 65, 0.4);
  border-left: 3px solid var(--green);
  padding: 12px 16px;
  display: flex;
  gap: 12px;
  align-items: center;
  box-shadow: 0 0 20px rgba(0, 255, 65, 0.1);
  max-width: 320px;
}

.icon { font-size: 20px; flex-shrink: 0; }

.title {
  font-size: 10px;
  color: var(--green);
  letter-spacing: 2px;
  margin-bottom: 2px;
  font-family: var(--font-mono);
}

.desc {
  font-size: 10px;
  color: rgba(0, 255, 65, 0.5);
  letter-spacing: 1px;
  font-family: var(--font-mono);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/AchievementToast.tsx src/components/AchievementToast.module.css
git commit -m "feat: AchievementToast with Framer Motion queue animation"
```

---

## Task 15: `Terminal` easter egg component

**Files:**
- Create: `src/components/Terminal.tsx`
- Create: `src/components/Terminal.module.css`

- [ ] **Step 1: Create `src/components/Terminal.tsx`**

```tsx
// src/components/Terminal.tsx
'use client';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { parseCommand } from '@/lib/parseCommand';
import styles from './Terminal.module.css';

interface TerminalLine {
  id: number;
  type: 'input' | 'output' | 'error';
  content: string;
}

export function Terminal() {
  const [open, setOpen]     = useState(false);
  const [input, setInput]   = useState('');
  const [lines, setLines]   = useState<TerminalLine[]>([
    { id: 0, type: 'output', content: 'DIVINE_OS TERMINAL v2.0.25\nType "help" for available commands.' },
  ]);
  const inputRef  = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lineId    = useRef(1);

  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.ctrlKey && e.key === '`') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 350);
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [lines]);

  const addLine = (type: TerminalLine['type'], content: string) => {
    setLines((prev) => [...prev, { id: lineId.current++, type, content }]);
  };

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim()) return;

    addLine('input', `> ${input}`);
    const result = parseCommand(input);

    switch (result.type) {
      case 'text':
        addLine('output', result.content);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'close':
        setOpen(false);
        break;
      case 'scroll':
        document.getElementById(result.sectionId)?.scrollIntoView({ behavior: 'smooth' });
        setOpen(false);
        break;
      case 'unknown':
        addLine('error', `bash: ${result.input}: command not found`);
        break;
    }

    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSubmit();
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className={styles.terminal}
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 260 }}
        >
          <div className={styles.header}>
            <span>DIVINE_OS TERMINAL</span>
            <button className={styles.close} onClick={() => setOpen(false)} data-cursor-hover>
              [X] CLOSE
            </button>
          </div>

          <div className={styles.output}>
            {lines.map((line) => (
              <pre key={line.id} className={`${styles.line} ${styles[line.type]}`}>
                {line.content}
              </pre>
            ))}
            <div ref={bottomRef} />
          </div>

          <form onSubmit={handleSubmit} className={styles.inputRow}>
            <span className={styles.prompt}>{'>'}</span>
            <input
              ref={inputRef}
              className={styles.input}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              spellCheck={false}
              autoComplete="off"
              aria-label="Terminal input"
            />
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
```

- [ ] **Step 2: Create `src/components/Terminal.module.css`**

```css
/* src/components/Terminal.module.css */
.terminal {
  position: fixed;
  bottom: 0; left: 0; right: 0;
  height: 70vh;
  background: rgba(0, 5, 0, 0.97);
  border-top: 1px solid rgba(0, 255, 65, 0.4);
  z-index: 8000;
  display: flex;
  flex-direction: column;
  font-family: var(--font-mono);
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid rgba(0, 255, 65, 0.15);
  font-size: 11px;
  letter-spacing: 3px;
  color: rgba(0, 255, 65, 0.6);
}

.close {
  background: none;
  border: 1px solid rgba(0, 255, 65, 0.3);
  color: rgba(0, 255, 65, 0.5);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 2px;
  padding: 4px 10px;
  cursor: none;
  transition: color 0.2s, border-color 0.2s;
}

.close:hover { color: var(--green); border-color: var(--green); }

.output {
  flex: 1;
  overflow-y: auto;
  padding: 16px 20px;
}

.line { font-size: 13px; line-height: 1.7; white-space: pre-wrap; margin-bottom: 4px; }

.input-type  { color: rgba(0, 255, 65, 0.6); }
.output      { color: rgba(0, 255, 65, 0.85); }
.error       { color: rgba(255, 80, 80, 0.8); }

.inputRow {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 20px;
  border-top: 1px solid rgba(0, 255, 65, 0.15);
}

.prompt { color: var(--green); font-size: 14px; }

.input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--green);
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: 1px;
  cursor: none;
  caret-color: var(--green);
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Terminal.tsx src/components/Terminal.module.css
git commit -m "feat: Terminal easter egg with Ctrl+\` toggle and command parsing"
```

---

## Task 16: `ParticleCanvas` component

**Files:**
- Create: `src/components/ParticleCanvas.tsx`

- [ ] **Step 1: Create `src/components/ParticleCanvas.tsx`**

```tsx
// src/components/ParticleCanvas.tsx
'use client';
import { useEffect, useRef } from 'react';

interface Particle {
  x: number; y: number;
  vx: number; vy: number;
  size: number; opacity: number;
}

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const particles: Particle[] = Array.from({ length: 120 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 1.5 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
    }));

    let mx = canvas.width / 2, my = canvas.height / 2;
    const onMove = (e: MouseEvent) => { mx = e.clientX; my = e.clientY; };
    document.addEventListener('mousemove', onMove);

    let rafId: number;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particles) {
        const dx = p.x - mx, dy = p.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) { p.vx += (dx / dist) * 0.08; p.vy += (dy / dist) * 0.08; }
        p.vx *= 0.98; p.vy *= 0.98;
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle   = `rgba(0,255,65,${p.opacity})`;
        ctx.shadowBlur  = 6;
        ctx.shadowColor = '#00ff41';
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const d = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
          if (d < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0,255,65,${0.08 * (1 - d / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      rafId = requestAnimationFrame(draw);
    };
    rafId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMove);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: 'absolute', inset: 0, zIndex: 0 }}
      aria-hidden
    />
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ParticleCanvas.tsx
git commit -m "feat: interactive particle canvas with mouse repulsion"
```

---

## Task 17: Six section components

**Files:**
- Create: `src/components/sections/Hero.tsx` / `.module.css`
- Create: `src/components/sections/About.tsx` / `.module.css`
- Create: `src/components/sections/Experience.tsx` / `.module.css`
- Create: `src/components/sections/Projects.tsx` / `.module.css`
- Create: `src/components/sections/Skills.tsx` / `.module.css`
- Create: `src/components/sections/Contact.tsx` / `.module.css`

- [ ] **Step 1: Create `src/components/sections/Hero.tsx`**

```tsx
// src/components/sections/Hero.tsx
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
          <span className={styles.g1} aria-hidden>DIVINE AMAKOR</span>
          <span className={styles.g2} aria-hidden>DIVINE AMAKOR</span>
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
```

- [ ] **Step 2: Create `src/components/sections/Hero.module.css`**

```css
/* src/components/sections/Hero.module.css */
.hero {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 5;
  padding: 0 80px;
}

.tag {
  font-size: 11px;
  letter-spacing: 6px;
  color: rgba(0, 255, 65, 0.5);
  text-transform: uppercase;
  margin-bottom: 16px;
}

.cursor { animation: blink 1s step-end infinite; }

.name {
  font-size: clamp(52px, 8vw, 96px);
  font-weight: 900;
  color: var(--green);
  text-shadow: 0 0 40px rgba(0, 255, 65, 0.6), 0 0 80px rgba(0, 255, 65, 0.2);
  letter-spacing: -2px;
  line-height: 1;
  position: relative;
  display: inline-block;
}

.g1, .g2 {
  position: absolute;
  inset: 0;
  background: var(--bg);
  pointer-events: none;
}

.g1 { color: rgba(0, 255, 65, 0.8); animation: nameGlitch1 4s infinite; clip-path: polygon(0 20%, 100% 20%, 100% 30%, 0 30%); }
.g2 { color: rgba(255,255,255,0.6); animation: nameGlitch2 4s infinite; clip-path: polygon(0 65%, 100% 65%, 100% 70%, 0 70%); }

.sub {
  margin-top: 16px;
  font-size: clamp(14px, 2vw, 20px);
  color: rgba(0, 255, 65, 0.6);
  letter-spacing: 4px;
}

.role {
  margin-top: 8px;
  font-size: 13px;
  color: rgba(0, 255, 65, 0.4);
  letter-spacing: 2px;
}

.line {
  margin-top: 32px;
  width: 80px; height: 1px;
  background: linear-gradient(90deg, var(--green), transparent);
  box-shadow: 0 0 8px rgba(0, 255, 65, 0.4);
}

.cta { margin-top: 40px; display: flex; gap: 16px; }

.btn {
  padding: 12px 28px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
  cursor: none;
  border: none;
  transition: box-shadow 0.2s;
}

.btnPrimary { background: var(--green); color: #000; box-shadow: 0 0 20px rgba(0, 255, 65, 0.4); }
.btnPrimary:hover { box-shadow: 0 0 32px rgba(0, 255, 65, 0.7); }
.btnSecondary { background: transparent; color: var(--green); border: 1px solid rgba(0, 255, 65, 0.4); }
.btnSecondary:hover { border-color: var(--green); box-shadow: 0 0 12px rgba(0, 255, 65, 0.2); }

.scrollHint {
  position: absolute;
  bottom: 40px; left: 0;
  font-size: 10px;
  color: rgba(0, 255, 65, 0.3);
  letter-spacing: 3px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.scrollLine {
  width: 40px; height: 1px;
  background: rgba(0, 255, 65, 0.3);
  animation: scrollPulse 2s ease-in-out infinite;
}

@media (max-width: 767px) {
  .content { padding: 0 24px; }
  .cta { flex-direction: column; }
}
```

- [ ] **Step 3: Create `src/components/sections/About.tsx`**

```tsx
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
```

- [ ] **Step 4: Create `src/components/sections/About.module.css`**

```css
/* src/components/sections/About.module.css */
.section { min-height: 100vh; padding: 100px 80px 60px; display: flex; flex-direction: column; justify-content: center; border-top: 1px solid rgba(0, 255, 65, 0.08); }

.tag { font-size: 10px; letter-spacing: 5px; color: rgba(0, 255, 65, 0.4); text-transform: uppercase; margin-bottom: 12px; }

.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center; }

.bio p { font-size: 14px; line-height: 2; color: rgba(0, 255, 65, 0.65); margin-bottom: 16px; }
.bio strong { color: var(--green); }

.stats { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.statBox { border: 1px solid rgba(0, 255, 65, 0.2); padding: 20px; position: relative; background: var(--green-faint); cursor: none; }
.statBox::before { content: ''; position: absolute; top: -1px; left: 0; width: 30px; height: 2px; background: var(--green); }

.statNum { font-size: 36px; font-weight: 900; color: var(--green); text-shadow: 0 0 20px rgba(0, 255, 65, 0.5); }
.statLabel { font-size: 10px; color: rgba(0, 255, 65, 0.5); letter-spacing: 2px; margin-top: 4px; }

@media (max-width: 767px) { .section { padding: 80px 24px 40px; } .grid { grid-template-columns: 1fr; gap: 40px; } }
```

- [ ] **Step 5: Create `src/components/sections/Experience.tsx`**

```tsx
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
```

- [ ] **Step 6: Create `src/components/sections/Experience.module.css`**

```css
/* src/components/sections/Experience.module.css */
.section { min-height: 100vh; padding: 100px 80px 60px; display: flex; flex-direction: column; justify-content: center; border-top: 1px solid rgba(0, 255, 65, 0.08); }
.tag { font-size: 10px; letter-spacing: 5px; color: rgba(0, 255, 65, 0.4); text-transform: uppercase; margin-bottom: 12px; }
.timeline { position: relative; padding-left: 0; }
.timeline::before { content: ''; position: absolute; left: -1px; top: 0; bottom: 0; width: 1px; background: linear-gradient(180deg, var(--green), rgba(0, 255, 65, 0.1)); }
@media (max-width: 767px) { .section { padding: 80px 24px 40px; } }
```

- [ ] **Step 7: Create `src/components/sections/Projects.tsx`**

```tsx
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
```

- [ ] **Step 8: Create `src/components/sections/Projects.module.css`**

```css
/* src/components/sections/Projects.module.css */
.section { min-height: 100vh; padding: 100px 80px 60px; display: flex; flex-direction: column; justify-content: center; border-top: 1px solid rgba(0, 255, 65, 0.08); }
.tag { font-size: 10px; letter-spacing: 5px; color: rgba(0, 255, 65, 0.4); text-transform: uppercase; margin-bottom: 12px; }
.grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 24px; }
@media (max-width: 767px) { .section { padding: 80px 24px 40px; } .grid { grid-template-columns: 1fr; } }
```

- [ ] **Step 9: Create `src/components/sections/Skills.tsx`**

```tsx
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
```

- [ ] **Step 10: Create `src/components/sections/Skills.module.css`**

```css
/* src/components/sections/Skills.module.css */
.section { min-height: 100vh; padding: 100px 80px 60px; display: flex; flex-direction: column; justify-content: center; border-top: 1px solid rgba(0, 255, 65, 0.08); }
.tag { font-size: 10px; letter-spacing: 5px; color: rgba(0, 255, 65, 0.4); text-transform: uppercase; margin-bottom: 12px; }

.rpgCard { border: 1px solid rgba(0, 255, 65, 0.25); background: rgba(0, 255, 65, 0.03); padding: 32px; position: relative; }
.rpgCard::before { content: 'CHARACTER STATS'; position: absolute; top: -10px; left: 32px; font-size: 9px; letter-spacing: 4px; color: rgba(0, 255, 65, 0.5); background: #000; padding: 0 10px; }

.rpgHeader { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; }
.rpgName { font-size: 28px; font-weight: 900; text-shadow: 0 0 20px rgba(0, 255, 65, 0.5); }
.rpgClass { font-size: 11px; color: rgba(0, 255, 65, 0.5); letter-spacing: 3px; margin-top: 4px; }
.rpgLevel { font-size: 10px; color: rgba(0, 255, 65, 0.4); letter-spacing: 2px; text-align: right; }
.rpgLevelNum { font-size: 36px; font-weight: 900; display: block; line-height: 1; color: var(--green); }

.skillGrid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }

.badges { display: flex; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
.badge { padding: 6px 14px; border: 1px solid rgba(0, 255, 65, 0.2); font-size: 9px; letter-spacing: 2px; color: rgba(0, 255, 65, 0.5); background: rgba(0, 255, 65, 0.04); cursor: none; }

@media (max-width: 767px) { .section { padding: 80px 24px 40px; } .skillGrid { grid-template-columns: 1fr; } }
```

- [ ] **Step 11: Create `src/components/sections/Contact.tsx`**

```tsx
// src/components/sections/Contact.tsx
'use client';
import { FormEvent, useState } from 'react';
import { RevealWrapper } from '@/components/ui/RevealWrapper';
import { GlitchText } from '@/components/ui/GlitchText';
import styles from './Contact.module.css';

const LINKS = [
  { icon: '✉', label: 'amakorchiemela@gmail.com', href: 'mailto:amakorchiemela@gmail.com' },
  { icon: '📱', label: '+234 (702) 573-8353',       href: 'tel:+2347025738353'             },
  { icon: '🔗', label: 'LinkedIn',                   href: 'https://linkedin.com'          },
  { icon: '⌥',  label: 'GitHub',                    href: 'https://github.com/jinwukongx' },
];

export function Contact() {
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('sending');
    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: data,
        headers: { Accept: 'application/json' },
      });
      if (res.ok) { setStatus('sent'); form.reset(); }
      else setStatus('error');
    } catch {
      setStatus('error');
    }
  };

  return (
    <section id="contact" className={styles.section}>
      <RevealWrapper delay={0}><div className={styles.tag}>&gt; 06 // CONTACT.SH</div></RevealWrapper>
      <RevealWrapper delay={60}><GlitchText>GET IN TOUCH</GlitchText></RevealWrapper>
      <RevealWrapper delay={120}>
        <div className={styles.grid}>
          <div>
            <p className={styles.copy}>
              Open to <strong>full-time roles</strong>, <strong>freelance projects</strong>, and interesting conversations.<br /><br />
              Drop a message — response time: <strong>&lt; 24hrs</strong>.
            </p>
            <div className={styles.links}>
              {LINKS.map((l) => (
                <a key={l.label} href={l.href} className={styles.link} target="_blank" rel="noopener noreferrer" data-cursor-hover>
                  <span className={styles.linkIcon}>{l.icon}</span>
                  {l.label}
                </a>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <input name="name"    className={styles.field} type="text"  placeholder="> NAME_"    required />
            <input name="email"   className={styles.field} type="email" placeholder="> EMAIL_"   required />
            <textarea name="message" className={styles.field} placeholder="> MESSAGE_" rows={5}  required />
            <button type="submit" className={styles.submit} data-cursor-hover disabled={status === 'sending' || status === 'sent'}>
              {status === 'idle'    && 'TRANSMIT MESSAGE →'}
              {status === 'sending' && 'TRANSMITTING...'}
              {status === 'sent'    && 'MESSAGE SENT ✓'}
              {status === 'error'   && 'ERROR — RETRY'}
            </button>
          </form>
        </div>
      </RevealWrapper>
    </section>
  );
}
```

- [ ] **Step 12: Create `src/components/sections/Contact.module.css`**

```css
/* src/components/sections/Contact.module.css */
.section { min-height: 100vh; padding: 100px 80px 60px; display: flex; flex-direction: column; justify-content: center; border-top: 1px solid rgba(0, 255, 65, 0.08); }
.tag { font-size: 10px; letter-spacing: 5px; color: rgba(0, 255, 65, 0.4); text-transform: uppercase; margin-bottom: 12px; }

.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: start; }

.copy { font-size: 15px; color: rgba(0, 255, 65, 0.6); line-height: 2; }
.copy strong { color: var(--green); }

.links { display: flex; flex-direction: column; gap: 12px; margin-top: 32px; }

.link {
  display: flex; align-items: center; gap: 16px;
  padding: 14px 20px;
  border: 1px solid rgba(0, 255, 65, 0.15);
  font-size: 12px; letter-spacing: 2px;
  color: rgba(0, 255, 65, 0.6);
  text-decoration: none;
  transition: border-color 0.2s, background 0.2s, color 0.2s;
  cursor: none;
}

.link:hover { border-color: rgba(0, 255, 65, 0.5); background: rgba(0, 255, 65, 0.06); color: var(--green); }
.linkIcon { font-size: 16px; }

.form { display: flex; flex-direction: column; gap: 14px; }

.field {
  background: rgba(0, 255, 65, 0.03);
  border: 1px solid rgba(0, 255, 65, 0.2);
  padding: 14px 16px;
  font-family: var(--font-mono);
  font-size: 12px; letter-spacing: 1px;
  color: var(--green);
  outline: none;
  transition: border-color 0.2s;
  width: 100%;
  resize: vertical;
  cursor: none;
}

.field::placeholder { color: rgba(0, 255, 65, 0.3); }
.field:focus { border-color: rgba(0, 255, 65, 0.6); }

.submit {
  background: var(--green); color: #000;
  font-family: var(--font-mono);
  font-size: 11px; letter-spacing: 4px;
  padding: 14px; border: none;
  cursor: none; font-weight: 700; text-transform: uppercase;
  transition: box-shadow 0.2s, opacity 0.2s;
}

.submit:hover:not(:disabled) { box-shadow: 0 0 24px rgba(0, 255, 65, 0.5); }
.submit:disabled { opacity: 0.7; }

@media (max-width: 767px) { .section { padding: 80px 24px 40px; } .grid { grid-template-columns: 1fr; gap: 40px; } }
```

- [ ] **Step 13: Commit all sections**

```bash
git add src/components/sections/
git commit -m "feat: all six section components — Hero, About, Experience, Projects, Skills, Contact"
```

---

## Task 18: Wire up `layout.tsx` and `page.tsx`

**Files:**
- Modify: `src/app/layout.tsx`
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Write `src/app/layout.tsx`**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';
import { ClientShell } from './ClientShell';

export const metadata: Metadata = {
  title: 'Divine Amakor — Full-Stack Engineer',
  description: 'Portfolio of Divine Amakor, Full-Stack Engineer specialising in MERN stack and machine learning.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientShell>{children}</ClientShell>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Create `src/app/ClientShell.tsx`**

This holds all the 'use client' global features so `layout.tsx` stays a Server Component.

```tsx
// src/app/ClientShell.tsx
'use client';
import { ReactNode, useEffect, useState } from 'react';
import { BootScreen } from '@/components/BootScreen';
import { Cursor } from '@/components/Cursor';
import { HUD } from '@/components/HUD';
import { SectionNav } from '@/components/SectionNav';
import { AchievementToast } from '@/components/AchievementToast';
import { Terminal } from '@/components/Terminal';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useAchievements } from '@/hooks/useAchievements';
import { SECTION_IDS } from '@/lib/sections';

interface ClientShellProps { children: ReactNode; }

export function ClientShell({ children }: ClientShellProps) {
  const [booted, setBooted]       = useState(false);
  const [scrollPct, setScrollPct] = useState(0);
  const activeId                  = useActiveSection(SECTION_IDS);
  const { queue, trigger, dismiss } = useAchievements();

  // Track scroll percentage for XP bar
  useEffect(() => {
    const onScroll = () => {
      const el  = document.documentElement;
      const pct = (el.scrollTop / (el.scrollHeight - el.clientHeight)) * 100;
      setScrollPct(Math.min(100, pct));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Trigger achievements on section entry
  useEffect(() => {
    const sectionToAchievement: Record<string, string> = {
      about: 'about', experience: 'experience',
      projects: 'projects', skills: 'skills', contact: 'contact',
    };
    const achievementId = sectionToAchievement[activeId];
    if (achievementId) trigger(achievementId);
  }, [activeId, trigger]);

  // First-load achievement after boot
  const handleBootComplete = () => {
    setBooted(true);
    setTimeout(() => trigger('enter'), 1500);
  };

  return (
    <>
      {!booted && <BootScreen onComplete={handleBootComplete} />}
      <Cursor />
      <HUD activeSection={activeId} scrollPct={scrollPct} />
      <SectionNav activeId={activeId} />
      <AchievementToast queue={queue} onDismiss={dismiss} />
      <Terminal />
      <main style={{ opacity: booted ? 1 : 0, transition: 'opacity 0.8s ease' }}>
        {children}
      </main>
    </>
  );
}
```

- [ ] **Step 3: Write `src/app/page.tsx`**

```tsx
// src/app/page.tsx
import { Hero }       from '@/components/sections/Hero';
import { About }      from '@/components/sections/About';
import { Experience } from '@/components/sections/Experience';
import { Projects }   from '@/components/sections/Projects';
import { Skills }     from '@/components/sections/Skills';
import { Contact }    from '@/components/sections/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Projects />
      <Skills />
      <Contact />
    </>
  );
}
```

- [ ] **Step 4: Start dev server and verify full flow**

```bash
npm run dev
```

Open http://localhost:3000. Verify:
- Boot screen plays (terminal lines appear one by one)
- Hero fades in with particles, glitch name, HUD overlays
- Right-side nav dots visible and clickable
- Scroll down — each section triggers glitch reveal, achievement toast
- Cursor orb + ring active everywhere
- Press Ctrl+` — terminal opens, test commands

- [ ] **Step 5: Commit**

```bash
git add src/app/layout.tsx src/app/ClientShell.tsx src/app/page.tsx
git commit -m "feat: wire layout, ClientShell, and page — full site assembled"
```

---

## Task 19: Add `.gitignore` entry and Formspree setup

**Files:**
- Modify: `.gitignore`

- [ ] **Step 1: Add `.superpowers/` to `.gitignore`**

Open `.gitignore` and append:
```
# Brainstorm session files
.superpowers/
```

- [ ] **Step 2: Replace Formspree placeholder**

In `src/components/sections/Contact.tsx`, replace `YOUR_FORM_ID`:

1. Go to https://formspree.io → sign up with amakorchiemela@gmail.com → create a new form
2. Copy the form ID (looks like `xrgvpqkb`)
3. Replace `YOUR_FORM_ID` in the fetch URL with the real ID

- [ ] **Step 3: Commit**

```bash
git add .gitignore src/components/sections/Contact.tsx
git commit -m "chore: gitignore superpowers dir, wire Formspree contact form"
```

---

## Task 20: Run full test suite and build verification

- [ ] **Step 1: Run all tests**

```bash
npm test
```

Expected: All tests pass. Minimum: `parseCommand` (9), `useActiveSection` (4), `useAchievements` (4), `GlitchText` (4), `SkillBar` (2) = 23 tests.

- [ ] **Step 2: Check TypeScript**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 3: Run production build**

```bash
npm run build
```

Expected: ✓ Compiled successfully. No warnings about missing keys or hydration errors.

- [ ] **Step 4: Manual end-to-end checklist**

Run `npm run dev` and verify each item:

- [ ] Boot sequence plays all 8 lines, progress bar fills, screen fades
- [ ] Hero: particles react to mouse, name glitches every ~4s, HUD coords update
- [ ] Right nav: hover pops label to 16px with spring bounce, siblings dim
- [ ] Scroll to About: glitch slam-in + scan tear + noise burst on entry
- [ ] Scroll to Experience: timeline appears, dots glow on hover
- [ ] Scroll to Projects: cards appear, top line sweeps on hover, cursor expands
- [ ] Scroll to Skills: RPG bars fill left-to-right with stagger
- [ ] Scroll to Contact: form fields focus with green border
- [ ] Achievement toasts fire for each section (check not duplicate)
- [ ] Ctrl+` opens terminal; test: `whoami`, `ls projects`, `ls skills`, `contact`, `clear`, `help`, `exit`
- [ ] Resize to 767px: HUD hidden, nav labels hidden (dots only), single-column layout
- [ ] XP bar in top-left HUD fills as you scroll

- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "feat: complete cyberpunk portfolio — all features verified"
```

---

## Deployment

After final commit, deploy to Vercel:

```bash
npx vercel --prod
```

Or push to GitHub and connect repo to Vercel dashboard for automatic deploys on push.
