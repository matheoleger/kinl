import type { CreateLinkSchema } from '@kinl/codegen-api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export function useLinks() {
  return useQuery({
    queryKey: ['links'],
    queryFn: () => apiClient.linksControllerGetAllLinks(),
  });
}

interface UseCreateLinkOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useCreateLink({ onSuccess, onError }: UseCreateLinkOptions = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: ['links'],
    mutationFn: async (data: CreateLinkSchema) => {
      const res = await apiClient.linksControllerCreateLink({ body: data });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success(t('links.create_link_dialog.form.success'));
    },
    onError: (error) => {
      onError?.(error);
      console.error(error);
      toast.error(t(`api_errors.${error.message}`));
    },
  });
}
