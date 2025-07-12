import { useQuery } from '@tanstack/react-query';
import { apiClient } from '@/lib/api-client';

export function useLinks() {
  return useQuery({
    queryKey: ['links'],
    queryFn: () => apiClient.linksControllerGetAllLinks(),
  });
}
