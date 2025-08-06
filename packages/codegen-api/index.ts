import type { Config } from './client/client';
import { client } from './client/client.gen';
import * as sdk from './client/sdk.gen';

export * from './client/client.gen';
export * from './client/schemas.gen';
export * from './client/types.gen';
export * from './client/zod.gen';

interface Error {
  message: string;
  statusCode: number;
  [key: string]: any;
}

export function createApiClient(config: Config) {
  client.setConfig(config);

  let isRefreshing = false;
  let refreshPromise: Promise<any> | null = null;

  const refreshTokens = async (url: string) => {
    if (url.includes('/auth/')) {
      return;
    }

    if (!isRefreshing) {
      isRefreshing = true;
      refreshPromise = sdk.authControllerRefreshToken({ client })
        .then((res) => {
          if (res.error) {
            throw new Error((res.error as Error).message || 'Failed to refresh');
          }
        })
        .finally(() => {
          isRefreshing = false;
        });
    }
    return refreshPromise;
  };

  client.interceptors.request.use((request) => {
    return request;
  });

  client.interceptors.error.use(async (error) => {
    return error;
  });

  type SdkFunctions = keyof typeof sdk;
  const apiClient = Object.entries(sdk).reduce((acc, [key, func]) => {
    if (typeof func === 'function') {
      acc[key as SdkFunctions] = (async (options?: any) => {
        const response = await func({ ...options, client });

        if (response.error && (response.error as Error).statusCode === 401) {
          // Try refresh
          await refreshTokens(response.request.url);

          // Retry request after refresh
          return func({ ...options, client });
        }

        return response;
      }) as any;
    }
    return acc;
  }, {} as { [K in SdkFunctions]: typeof sdk[K] });

  return apiClient;
}
