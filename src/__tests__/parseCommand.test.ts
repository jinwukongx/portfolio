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
