import type { RegisterSchema, SignInSchema } from '@kinl/codegen-api';
import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export function useLogin() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }: SignInSchema) => {
      const res = await apiClient.authControllerSignIn({ body: { email, password } });

      if (res.error) {
        throw new Error((res.error as Error).message, { cause: 'api_error' });
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success(t('auth.login.form.success'));
      navigate('/');
    },
    onError: (error) => {
      if (error.cause === 'api_error') {
        toast.error(t(`api_errors.${error.message}`));
      }
      else {
        toast.error(t('api_errors.unknown'));
      }
    },
  });
}

export function useLogout() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.authControllerLogout();

      if (res.error) {
        throw new Error((res.error as Error).message, { cause: 'api_error' });
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success(t('auth.logout.success'));
      navigate('/login');
    },
    onError: (error) => {
      if (error.cause === 'api_error') {
        toast.error(t(`api_errors.${error.message}`));
      }
      else {
        toast.error(t('api_errors.unknown'));
      }
    },
  });
}

export function useRegister() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, username, password }: RegisterSchema) => {
      const res = await apiClient.authControllerRegister({
        body: { email, username, password },
      });

      if (res.error) {
        throw new Error((res.error as Error).message, { cause: 'api_error' });
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success(t('auth.register.form.success'));
      navigate('/login');
    },
    onError: (error) => {
      if (error.cause === 'api_error') {
        toast.error(t(`api_errors.${error.message}`));
      }
      else {
        toast.error(t('api_errors.unknown'));
      }
    },
  });
}
