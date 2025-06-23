// import { createApiClient } from '@kinl/generated-api';

import { createApiClient } from '@kinl/generated-api';

export const apiClient = createApiClient({
  baseUrl: import.meta.env.VITE_API_URL,
  credentials: 'include',
} as const);
