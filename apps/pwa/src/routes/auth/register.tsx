import { NavLink } from 'react-router';
import { RegisterForm } from '@/features/auth/register/register-form';

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
