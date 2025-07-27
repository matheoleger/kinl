import type { CreateTagsSchema, UpdateTagSchema } from '@kinl/codegen-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface UseTagsMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useTags() {
  return useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const res = await apiClient.tagsControllerGetAllTags();

      if (res.error) {
        throw res.error;
      }
      return res.data;
    },
  });
}

export function useCreateTags({ onSuccess, onError }: UseTagsMutationsOptions = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateTagsSchema) => {
      const res = await apiClient.tagsControllerCreateMultipleTags({ body: data });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success(t('tags.create_tags_dialog.form.success'));
    },
    onError: (error) => {
      onError?.(error);
      console.error(error);
      toast.error(t(`api_errors.${error.message}`));
    },
  });
}

export function useUpdateTag({ onSuccess, onError }: UseTagsMutationsOptions = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ tagId, data }: { tagId: string; data: UpdateTagSchema }) => {
      const res = await apiClient.tagsControllerUpdateTag({ path: { id: tagId }, body: data });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success(t('tags.card.actions.update.form.success'));
    },
    onError: (error) => {
      onError?.(error);
      console.error(error);
      toast.error(t(`api_errors.${error.message}`));
    },
  });
}

export function useDeleteTag() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tagId: string) => {
      const res = await apiClient.tagsControllerDeleteTag({ path: { id: tagId } });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tags'] });
      toast.success(t('tags.card.actions.delete.success'));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t(`api_errors.${error.message}`));
    },
  });
}
