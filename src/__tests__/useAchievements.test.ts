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
