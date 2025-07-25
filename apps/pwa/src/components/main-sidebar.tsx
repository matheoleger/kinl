import { ChevronUpIcon, DoorOpenIcon, LayoutDashboardIcon, TagsIcon, User2Icon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { NavLink, useLocation } from 'react-router';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/auth/auth-provider';
import { useLogout } from '@/features/auth/hooks/auth';

export function MainSidebar() {
  const { t } = useTranslation();

  const { user } = useAuth();
  const { mutate: logout } = useLogout();

  const { pathname } = useLocation();

  return (
    <nav>
      <Sidebar variant="floating" className="w-72">
        <SidebarHeader>
          <SidebarMenu className="pt-8">
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/" className={`flex items-center gap-4 !text-base ${pathname === '/' && 'text-primary'}`}>
                  <LayoutDashboardIcon />
                  <span>{t('common.navigation.dashboard')}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <NavLink to="/tags" className={`flex items-center gap-4 !text-base ${pathname === '/tags' && 'text-primary'}`}>
                  <TagsIcon />
                  <span>{t('common.navigation.tags')}</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
          <hr className="border-border mx-6 my-2" />
        </SidebarContent>
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
