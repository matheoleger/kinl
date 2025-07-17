import { Trans, useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { LoginForm } from '@/features/auth/login/login-form';

export default function Login() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col justify-center items-center h-screen w-full mx-16 gap-4">
      <LoginForm />
      <p className="text-sm">
        <Trans t={t} i18nKey="auth.login.registerRedirection">
          <NavLink to="/register" className="font-bold"></NavLink>
        </Trans>
      </p>
    </div>
  );
}
