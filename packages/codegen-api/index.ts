import type { Config } from './client/client';
import { client } from './client/client.gen';
import * as sdk from './client/sdk.gen';

export * from './client/client.gen';
export * from './client/schemas.gen';
export * from './client/types.gen';
export * from './client/zod.gen';

export function createApiClient(config: Config) {
  client.setConfig(config);

  client.interceptors.request.use((request) => {
    return request;
  });

  client.interceptors.error.use((error) => {
    return error;
  });

  type SdkFunctions = keyof typeof sdk;

  const apiClient = Object.entries(sdk).reduce((acc, [key, func]) => {
    if (typeof func === 'function') {
      acc[key as SdkFunctions] = ((options?: any) =>

        func({ ...options, client })) as any;
    }
    return acc;
  }, {} as { [K in SdkFunctions]: typeof sdk[K] });

  return apiClient;
}
