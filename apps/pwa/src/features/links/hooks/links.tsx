import type { CreateLinkSchema, UpdateLinkSchema } from '@kinl/codegen-api';
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

interface UseLinkMutationsOptions {
  onSuccess?: () => void;
  onError?: (error: unknown) => void;
}

export function useCreateLink({ onSuccess, onError }: UseLinkMutationsOptions = {}) {
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

export function useDeleteLink() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkId: string) => {
      const res = await apiClient.linksControllerDeleteLink({ path: { id: linkId } });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success(t('links.delete.success'));
    },
    onError: (error) => {
      console.error(error);
      toast.error(t(`api_errors.${error.message}`));
    },
  });
}

export function useUpdateLink({ onSuccess, onError }: UseLinkMutationsOptions = {}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateLinkSchema }) => {
      const res = await apiClient.linksControllerUpdateLink({ path: { id }, body: data });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
    onSuccess: () => {
      onSuccess?.();
      queryClient.invalidateQueries({ queryKey: ['links'] });
      toast.success(t('links.update_link_dialog.form.success'));
    },
    onError: (error) => {
      onError?.(error);
      console.error(error);
      toast.error(t(`api_errors.${error.message}`));
    },
  });
}
