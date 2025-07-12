import { NavLink, redirect } from 'react-router';
import { RegisterForm } from '@/features/auth/register/register-form';
import { apiClient } from '@/lib/api-client';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
  const res = await apiClient.authControllerMe();

  if (res.data) {
    return redirect('/');
  }
}

export default function Register() {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full mx-16 gap-4">
      <RegisterForm />
      <p className="text-sm">
        You already have an account?
        {' '}
        <NavLink to="/login" className="font-bold">Login</NavLink>
      </p>
    </div>
  );
}
