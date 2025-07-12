import type { RegisterSchema, SignInSchema } from '@kinl/codegen-api';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

export function useLogin() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, password }: SignInSchema) => {
      const res = await apiClient.authControllerSignIn({ body: { email, password } });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success('Successfully logged in');
      navigate('/');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}

export function useLogout() {
  return useQuery({
    queryKey: ['auth'],
    queryFn: () => apiClient.authControllerLogout(),
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ email, username, password }: RegisterSchema) => {
      const res = await apiClient.authControllerRegister({
        body: { email, username, password },
      });

      if (res.error) {
        throw res.error;
      }

      return res.data;
    },
    onSuccess: () => {
      toast.success('Successfully registered');
      navigate('/login');
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
