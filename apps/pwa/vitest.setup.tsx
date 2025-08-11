import { vi } from 'vitest';

import '@testing-library/jest-dom';
import '@testing-library/jest-dom/vitest';

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(globalThis as any).ResizeObserver = ResizeObserver;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<any>('react-router');
  return {
    ...actual,
    BrowserRouter: ({ children }: any) => <div>{children}</div>,
    Link: ({ children }: any) => <a>{children}</a>,
    useNavigate: () => vi.fn(),
  };
});
