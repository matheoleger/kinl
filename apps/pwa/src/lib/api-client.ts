import { createApiClient } from '@kinl/codegen-api';

export const apiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
} as const);
