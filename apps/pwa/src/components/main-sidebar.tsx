import { ChevronUpIcon, DoorOpenIcon, User2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth/auth-provider';
import { useLogout } from '@/features/auth/hooks/auth';

export function MainSidebar() {
  const { t } = useTranslation();

  const { user } = useAuth();
  const { mutate: logout } = useLogout();

  return (
    <nav>
      <Sidebar variant="floating" className="w-72">
        <SidebarHeader />
        <SidebarContent />
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton className="h-full flex">
                    <User2Icon className="!size-6" />
                    <div>
                      <p className="text-md">{user?.username}</p>
                      <p className="text-sm">
                        {user?.email}
                      </p>
                    </div>
                    <ChevronUpIcon className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="top" className="w-64">
                  <DropdownMenuItem className="h-12" asChild>
                    <Button variant="ghost" className="m-0 w-full items-center justify-start flex gap-4" onClick={() => logout()}>
                      <DoorOpenIcon />
                      <p>{t('auth.logout.title')}</p>
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </nav>
  );
}
