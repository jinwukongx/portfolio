// src/lib/sections.ts
export interface SectionMeta {
  id: string;
  label: string;
  navLabel: string;
}

export const SECTIONS: SectionMeta[] = [
  { id: 'hero',       label: '01 // HERO',           navLabel: 'HOME'       },
  { id: 'about',      label: '02 // ABOUT.EXE',      navLabel: 'ABOUT'      },
  { id: 'experience', label: '03 // EXPERIENCE.LOG',  navLabel: 'EXPERIENCE' },
  { id: 'projects',   label: '04 // PROJECTS.DIR',    navLabel: 'PROJECTS'   },
  { id: 'skills',     label: '05 // SKILLS.STAT',     navLabel: 'SKILLS'     },
  { id: 'contact',    label: '06 // CONTACT.SH',      navLabel: 'CONTACT'    },
];

export const SECTION_IDS = SECTIONS.map((s) => s.id);
