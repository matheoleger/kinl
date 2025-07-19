import type { SafeUserSchema } from '@kinl/codegen-api';
import { useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router';
import { MainSidebar } from '@/components/main-sidebar';
import { MainTopbar } from '@/components/main-topbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth/auth-provider';
import TopBarProvider from '@/contexts/topbar/topbar-provider';
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
      <TopBarProvider>
        <main className="flex min-h-screen w-full bg-background">
          <MainSidebar />
          <div className="flex-1 flex flex-col items-center gap-16 min-h-0 w-full my-2 mr-2 ml-8">
            <MainTopbar />
            <Outlet />
          </div>
        </main>
      </TopBarProvider>
    </SidebarProvider>
  );
}
