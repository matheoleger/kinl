import { Outlet, redirect } from 'react-router';
import logo from '@/assets/logo/logo-color.svg';
import { apiClient } from '@/lib/api-client';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
  const res = await apiClient.authControllerMe();

  if (res.data) {
    return redirect('/');
  }
}

export default function AuthLayout() {
  return (
    <div className="flex items-center justify-center h-screen background-gradient-dark">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <Outlet />
      </div>
      <div className="flex-1 flex flex-col items-center justify-center gap-16  m-6 h-[calc(100vh-3rem)] rounded-lg border bg-card/70">
        <div className="max-w-[350px] flex flex-col justify-center items-center w-full space-y-6 px-4">
          {/* <div className="max-w-[350px] flex flex-col w-full space-y-6 px-4"> */}
          <div className="flex items-center gap-4">
            <img src={logo} alt="kinL logo" className="w-14" />
            <h1 className="text-6xl font-bold font-logo">kinL</h1>
          </div>
          <p className="text-sm">
            A link sharing service that allows you to share links with your friends and colleagues.
          </p>
        </div>
      </div>
    </div>
  );
}
