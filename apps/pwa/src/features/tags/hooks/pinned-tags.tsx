import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface UsePinnedTagsMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function usePinnedTags() {
  return useQuery({
    queryKey: ['pinnedTags'],
    queryFn: async () => {
      const res = await apiClient.tagsControllerGetAllPinnedTags();

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
  });
}

export function useCreatePinnedTag({ onError, onSuccess }: UsePinnedTagsMutationsOptions = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      const res = await apiClient.tagsControllerCreatePinnedTag({ path: { tagId } });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['pinnedTags'] });
      toast.success(t('tags.pinned_tag.pin.success'));
    },
    onError: (error) => {
      onError?.(error);
      console.error(error);
      toast.error(t(`api_errors.${error.message}`));
    },
  });
}

export function useDeletePinnedTag() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      const res = await apiClient.tagsControllerDeletePinnedTag({ path: { tagId } });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pinnedTags'] });
      toast.success(t('tags.pinned_tag.unpin.success'));
    },
    onError: (error) => {
      toast.error(t(`api_errors.${error.message}`));
    },
  });
}
