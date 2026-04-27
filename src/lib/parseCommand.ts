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
