import { NavLink, redirect } from 'react-router';
import { LoginForm } from '@/features/auth/login/login-form';
import { apiClient } from '@/lib/api-client';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
  const res = await apiClient.authControllerMe();

  if (res.data) {
    return redirect('/');
  }
}

export default function Login() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full mx-16 gap-4">
      <LoginForm />
      <p className="text-sm">
        Don't have an account?
        {' '}
        <NavLink to="/register" className="font-bold">Register</NavLink>
      </p>
    </div>
  );
}
