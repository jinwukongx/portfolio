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
