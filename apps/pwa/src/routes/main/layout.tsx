import type { SafeUserSchema } from '@kinl/codegen-api';
import { useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router';
import { MainSidebar } from '@/components/main-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth/auth-provider';
import { authLoader } from '@/lib/auth-loader';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
  return await authLoader();
}

export default function MainLayout() {
  const user = useLoaderData() as SafeUserSchema;
  const { setUser } = useAuth();

  useEffect(() => {
    setUser(user);
  }, [user, setUser]);

  return (
    <SidebarProvider>
      <div className="flex flex-col items-center justify-center h-screen w-full bg-background">
        <MainSidebar />
        <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
          <Outlet />
        </div>
      </div>
    </SidebarProvider>
  );
}
