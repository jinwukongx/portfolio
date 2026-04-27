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
