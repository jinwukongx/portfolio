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
