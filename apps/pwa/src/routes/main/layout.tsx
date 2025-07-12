import { Outlet } from 'react-router';
import { MainSidebar } from '@/components/main-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { authLoader } from '@/lib/auth-loader';

// eslint-disable-next-line react-refresh/only-export-components
export async function clientLoader() {
  await authLoader();
}

export default function MainLayout() {
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
