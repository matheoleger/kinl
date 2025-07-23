import type { CreateTagsSchema } from '@kinl/codegen-api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface UseTagsMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useTags() {

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
