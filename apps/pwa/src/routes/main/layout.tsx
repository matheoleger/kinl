import type { SafeUserSchema } from '@kinl/codegen-api';
import { useEffect } from 'react';
import { Outlet, useLoaderData } from 'react-router';
import { AddDialog } from '@/components/common/add-dialog';
import { MainSidebar } from '@/components/main-sidebar';
import { MainTopbar } from '@/components/main-topbar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth/auth-provider';
import TopBarProvider from '@/contexts/topbar/topbar-provider';
import { authLoader } from '@/lib/auth-loader';

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
        <div className="flex min-h-screen w-full bg-background">
          <MainSidebar />
          <div className="flex flex-col w-full">
            <MainTopbar />
            <main className="flex flex-1 w-full gap-16 my-2 md:px-2 mt-8">
              <Outlet />
            </main>
            <div className="md:hidden w-full sticky bottom-0 flex flex-row justify-end gap-2 px-4 py-4">
              <AddDialog mobile />
            </div>
          </div>
        </div>
      </TopBarProvider>
    </SidebarProvider>
  );
}
