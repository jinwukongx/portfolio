# Divine Amakor Portfolio — Design Spec
**Date:** 2026-04-27  
**Stack:** Next.js 14 + TypeScript + GSAP + Framer Motion  
**Status:** Approved

---

## Context

Build a personal portfolio website for Divine Amakor (Full-Stack Engineer, Industrial Mathematics & CS graduate) from a blank directory. The goal is a jaw-dropping, game-like cyberpunk experience that makes a lasting impression on recruiters and collaborators — not a standard portfolio template. Every interaction should feel alive.

---

## Visual Identity

| Property | Value |
|---|---|
| Background | Pure black `#000000` |
| Primary accent | Matrix green `#00ff41` |
| Secondary | White `#ffffff` (glitch flashes only) |
| Tertiary | Cyan `#00ffff` (glitch layer only) |
| Font | `'Courier New', monospace` — terminal aesthetic throughout |
| Vibe | Cyberpunk OS / hacker terminal |

Global overlays applied to every section:
- Repeating scanline texture (`repeating-linear-gradient`) at 1.2% opacity
- Radial vignette darkening edges
- `cursor: none` — default cursor replaced globally

---

## Site Structure

Single-page full-scroll. Six sections in order:

1. **Hero** — boot screen → main landing
2. **About** — bio + impact stats
3. **Experience** — dot timeline
4. **Projects** — neon cards grid
5. **Skills** — RPG character stat sheet
6. **Contact** — split layout with form + links

---

## Global Game Features

### 1. Custom Cursor (everywhere)
- 12×12px glowing green orb (`box-shadow: 0 0 10px #00ff41`)
- 38×38px lagging ring trails behind via `requestAnimationFrame` lerp at 12% per frame
- On hover over interactive elements: orb becomes hollow ring (border only), ring expands to 52px
- `cursor: none` on `body` — no native cursor visible at any point

### 2. HUD Overlay (persistent, all sections)
- Top-left: `DIVINE_OS v2.0.25`, `SYS: NOMINAL`, XP progress bar
- Top-right: live mouse X/Y coordinates, current section name, FPS counter
- Bottom-left: `LAT: 9.0765° N`, `ABUJA, FCT // NG`
- Bottom-right: static flavor node count (`NODES: 247`), `CONNECTION: SECURE`
- Right edge: vertical section nav (see below)
- All HUD elements use `pointer-events: none` except the nav dots

### 3. Right-Side Section Nav
Six items: HOME · ABOUT · EXPERIENCE · PROJECTS · SKILLS · CONTACT  
- Base font: 12px, letter-spacing 3px, `rgba(0,255,65,0.35)`
- Active section: full green, 13px, glow
- **Hover**: spring-bounce scale to 16px (`cubic-bezier(0.34,1.56,0.64,1)`), translateX(-6px), full glow, dot scales 1.4×
- Non-hovered siblings dim to `rgba(0,255,65,0.2)` while one is hovered
- Smooth 250ms transitions on all properties between items
- Clicking scrolls to section smoothly

### 4. Scroll Reveal — Heavy Glitch Entry
Every section's content elements carry a `.reveal` class and start at `opacity:0, translateY(28px), blur(3px)`.  
On `IntersectionObserver` trigger (threshold 0.12):
- **Entry keyframe** (`revealHeavy`, 0.8s, `steps(1)`): slams in, fires two sequential glitch bursts — each burst shatters the element into 3 `clip-path` horizontal strips that translate ±8–18px independently before snapping together
- **Section titles**: additionally get 3 named `<span>` glitch layers (green / white / cyan) that animate with different `translateX` timings (up to ±22px) via `gLayer1/2/3` keyframes for 700ms
- **Scan tear**: a 2px horizontal line races across the section at 3 random vertical positions (20%, 55%, 75%) when the section tag enters view
- **Static noise burst**: fractal SVG noise overlay pulses at ~15% opacity for 500ms using `steps(1)` to simulate analog static
- Children stagger with 60–80ms delays

### 5. Boot / Loading Screen
Appears on first load, covers the full viewport. Sequence:
1. Terminal lines appear one by one (8 lines, 300ms apart):
   - `DIVINE_OS v2.0.25 — KERNEL BOOT SEQUENCE INITIATED`
   - `[ OK ] Loading neural interface`
   - `[ OK ] Mounting project archives`
   - `[ OK ] Initialising MERN stack modules`
   - `[ OK ] Syncing portfolio data`
   - `[ WARN ] Exceptional skills detected — proceed with caution`
   - `[ OK ] All systems nominal. Welcome.`
   - `LOADING DIVINE.EXE ████████████████ 100%`
2. Progress bar fills over 1s
3. Boot screen fades out at 3.6s; hero content fades in at 4s

### 6. Interactive Particle Field (Hero background)
- 120 particles rendered on a `<canvas>` behind the hero
- Each particle: 0.5–2px radius, random velocity, glowing green
- Mouse repulsion: particles within 120px radius flee the cursor
- Connection lines drawn between particles within 90px (opacity inversely proportional to distance)
- Canvas redraws every frame via `requestAnimationFrame`
- Persists only in the Hero section; other sections have scanline-only background

### 7. Achievement Notifications
Xbox/PlayStation-style toast notifications triggered by user milestones:
- **"You entered the portfolio. The journey begins."** — fires 1.5s after hero content becomes visible (~5.5s from page load)
- **"Curious, are we? You scrolled to About."** — on About entry
- **"You've seen my work history."** — on Experience entry  
- **"Project explorer. Nice."** — on Projects entry
- **"You checked my stats. Respect."** — on Skills entry
- **"Ready to connect? Bold move."** — on Contact entry

Toast anatomy: left border `3px solid #00ff41`, dark bg, trophy emoji, title in caps + description. Slides in from left, auto-dismisses after 3s.

### 8. Hidden Terminal Easter Egg
Activated by pressing `` Ctrl+` `` anywhere on the page.  
A fake terminal slides up from the bottom (80vh tall, dark bg, green text).  
Supported commands:
- `whoami` → prints bio summary
- `ls projects` → lists projects with links
- `ls skills` → prints skill list
- `contact` → scrolls to Contact section and closes terminal
- `clear` → clears terminal output
- `help` → prints command list
- `exit` / `close` → dismisses terminal

---

## Section Designs

### Hero
- Tag: `> PORTFOLIO.EXE _` (blinking cursor)
- H1: `DIVINE AMAKOR` — 96px, weight 900, green glow + periodic glitch (fires every ~4s)
- Sub: `FULL-STACK ENGINEER` — 20px, letter-spacing 4px, 60% opacity
- Role line: `> Industrial Mathematics + Computer Science · Abuja, NG`
- Divider: 80px gradient line
- CTAs: `VIEW PROJECTS` (filled green btn) + `CONTACT.SH` (outlined btn)
- Scroll hint: animated line + `SCROLL TO EXPLORE`
- Full particle canvas background
- All HUD elements visible

### About
- Tag: `> 02 // ABOUT.EXE`
- 2-col grid: bio text left, impact stat boxes right
- Stats pulled directly from resume metrics: 40% vendor engagement, 50% DB speed, 30% error reduction, 3+ years
- Each stat box: top accent bar, large number with glow, small label

### Experience
- Tag: `> 03 // EXPERIENCE.LOG`
- Vertical timeline with left glow-line
- 3 entries from resume: Baze University intern, CU IT Support, CU Data Entry
- Each entry: dot (fills green on hover), date, role, company with `▸` prefix, bullet list
- Timeline dot glows brighter on section entry animation

### Projects
- Tag: `> 04 // PROJECTS.DIR`
- 2-col card grid
- Card 01: Algorithmic Stock Price Predictor — full details, tech tags, GitHub link
- Card 02: `LOCKED` — dashed border, 45% opacity, placeholder for future projects
- Card hover: `translateY(-4px)`, border brightens, top gradient line sweeps in from left

### Skills (RPG Sheet)
- Tag: `> 05 // SKILLS.STAT`
- Bordered card with `CHARACTER STATS` label cut into top border
- Header: name, class (`FULL-STACK ENGINEER // ML SPECIALIST`), level number (`42`)
- 8 skill bars in 2-col grid — all animate from 0% on scroll entry with 90ms stagger:
  - Python 88, React.js 85, Node.js 82, TypeScript 80, Next.js 80, MongoDB 78, TensorFlow 75, Java 70
- Badge row: MERN STACK, DEEP LEARNING, DATA PIPELINES, SYS ADMIN, TECH DOCS, CROSS-FUNC TEAMS
- Skill fill bar has a white leading edge `::after` pseudo-element

### Contact
- Tag: `> 06 // CONTACT.SH`
- 2-col: left = availability copy + 4 contact links; right = form (name, email, message, submit)
- Contact links: email, phone, LinkedIn, GitHub — hover brightens border + text
- Form fields: terminal-style, green-on-black, `> PLACEHOLDER_` style
- Submit: `TRANSMIT MESSAGE →` filled green button

---

## Component Architecture (Next.js)

```
src/
  app/
    layout.tsx          — global cursor, HUD, achievement system, terminal easter egg
    page.tsx            — assembles all sections
  components/
    Cursor.tsx          — orb + ring, interactive state
    HUD.tsx             — all 4 corner readouts + section nav
    SectionNav.tsx      — right-side nav with hover effects
    AchievementToast.tsx — toast system with queue
    Terminal.tsx        — easter egg terminal, Ctrl+` toggle
    ParticleCanvas.tsx  — canvas particle field
    BootScreen.tsx      — loading sequence
    sections/
      Hero.tsx
      About.tsx
      Experience.tsx
      Projects.tsx
      Skills.tsx
      Contact.tsx
    ui/
      GlitchText.tsx    — reusable glitch title wrapper
      RevealWrapper.tsx — scroll reveal + glitch entry HOC
      SkillBar.tsx      — animated RPG skill bar
      ProjectCard.tsx   — neon project card
      TimelineItem.tsx  — experience timeline entry
```

---

## Key Libraries

| Library | Purpose |
|---|---|
| `next` 14 | Framework, routing, layout |
| `typescript` | Type safety |
| `gsap` | Scroll-driven animations, timeline sequencing |
| `@gsap/react` | GSAP React integration |
| `framer-motion` | Component mount/unmount transitions |
| `formspree` (via fetch) | Contact form submission — no backend required |

All heavy animation components use `'use client'` directive. No SSR for canvas/cursor/HUD.

---

## Responsive Behavior

- **Desktop** (≥1024px): full layout as designed
- **Tablet** (768–1023px): single-column grids, reduced HUD corners (tl + tr only), nav dots shown without labels
- **Mobile** (<768px): full-width sections, HUD hidden except section nav, cursor disabled (touch devices)

---

## Deployment

- Platform: Vercel (zero-config Next.js)
- No backend required — contact form posts to Formspree via `fetch`
- `.superpowers/` added to `.gitignore`

---

## Verification

1. Run `npm run dev` — boot screen plays, hero loads with particles and HUD
2. Move mouse — cursor orb + lagging ring track globally, expand on buttons
3. Scroll through all 6 sections — each triggers glitch entry, scan tear, noise burst
4. Hover right nav — items pop with spring bounce, siblings dim
5. Scroll to Skills — bars animate from 0% with stagger
6. Trigger all 6 achievements by scrolling through the page
7. Press `` Ctrl+` `` — terminal slides up; test all 7 commands
8. Resize to mobile — cursor off, HUD collapses, layout reflows cleanly
9. `npm run build` — no TypeScript errors, no build warnings
