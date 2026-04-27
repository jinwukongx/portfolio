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

          <div className={styles.outputArea}>
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
              className={styles.inputField}
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
