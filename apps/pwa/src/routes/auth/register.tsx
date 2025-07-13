import { Trans, useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full mx-16 gap-4">
      <RegisterForm />
      <p className="text-sm">
        <Trans t={t} i18nKey="auth.register.loginRedirection">
          <NavLink to="/login" className="font-bold"></NavLink>
        </Trans>
      </p>
    </div>
  );
}
