import { useTranslation } from 'react-i18next';
import { Outlet, redirect } from 'react-router';
import logo from '@/assets/logo/logo-color.svg';
import { apiClient } from '@/lib/api-client';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
  try {
    const res = await apiClient.authControllerMe();

    if (res.data?.id && !res.error) {
      return redirect('/');
    }
  }
  catch (error) {
    console.error(error);
  }
}

export default function AuthLayout() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col-reverse lg:flex-row items-center justify-center h-screen background-gradient-dark">
      <div className="lg:flex-1 flex flex-col items-center gap-16 min-h-0">
        <Outlet />
      </div>
      <div className="lg:flex-1 flex flex-col items-center justify-center gap-16 m-6 lg:h-[calc(100vh-3rem)] rounded-lg lg:border lg:bg-card/70">
        <div className="max-w-[400px] flex flex-col justify-center items-center w-full space-y-6 px-4">
          <div className="flex items-center gap-4">
            <img src={logo} alt="kinL logo" className="w-14" />
            <h1 className="text-6xl font-bold font-logo">{t('common.app_name')}</h1>
          </div>
          <p className="text-sm hidden lg:inline">
            {t('common.baseline')}
          </p>
        </div>
      </div>
    </div>
  );
}
