import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import App from './App';

vi.mock('./services/api', () => ({
  productsService: {
    getCategories: vi.fn().mockResolvedValue([]),
    getAll: vi.fn().mockResolvedValue({ items: [], page: 1, totalPages: 1 }),
  },
  authService: {
    getProfile: vi.fn().mockResolvedValue(null),
  },
  cartService: {
    get: vi.fn().mockResolvedValue([]),
  },
  orderService: {},
  setToken: vi.fn(),
  apiCall: vi.fn(),
}));

describe('App Component', () => {
  it('renders without crashing', () => {
    const { container } = render(<App />);
    expect(container).toBeTruthy();
  });
});
