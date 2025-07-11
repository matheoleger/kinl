import { NavLink } from 'react-router';
import { LoginForm } from '@/features/auth/login/login-form';

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
