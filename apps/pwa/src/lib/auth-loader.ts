import { redirect } from 'react-router';
import { apiClient } from '@/lib/api-client';

export async function authLoader() {
  try {
    const { data: user, error } = await apiClient.authControllerMe();

    if (error) {
      throw new Error((error as any).message);
    }

    return user;
  }
  catch (error) {
    console.error(error);
    throw redirect('/login');
  }
}
