import { LinkIcon, MenuIcon, PlusIcon, TagIcon } from 'lucide-react';
import { useTopBar } from '@/contexts/topbar/topbar-provider';
import { TabsValue } from '@/contexts/topbar/types';
import { CreateLinkDialog } from '@/features/links/components/create-link-dialog';
import { CreateTagsDialog } from '@/features/tags/components/create-tags-dialog';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { useSidebar } from './ui/sidebar';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

export function MainTopbar() {
  const { selectedTab, setSelectedTab } = useTopBar();
  const { setOpenMobile } = useSidebar();

  return (
    <header className="w-full md:h-16 gap-2 rounded-md flex flex-row md:items-center items-start px-4 py-4 md:justify-between justify-center sticky top-0 bg-background z-10">
      <Button variant="outline" size="icon" className="md:hidden" onClick={() => setOpenMobile(true)}>
        <MenuIcon />
      </Button>
      <div className="flex md:flex-row flex-col md:items-center gap-4">
        <Input placeholder="Search" className="min-w-xs" />
        <Tabs value={selectedTab} onValueChange={value => setSelectedTab(value as TabsValue)}>
          <TabsList className="bg-card text-card-foreground border rounded-lg">
            <TabsTrigger value={TabsValue.ALL}>All</TabsTrigger>
            <TabsTrigger value={TabsValue.MINE}>Mine</TabsTrigger>
            <TabsTrigger value={TabsValue.SHARED}>Shared</TabsTrigger>
            <TabsTrigger value={TabsValue.FEEDS}>Feeds</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="md:flex hidden flex-row items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Add elements">
              <PlusIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent side="bottom" className="w-64 m-2 mx-4">
            <DropdownMenuItem className="h-12" asChild>
              <CreateLinkDialog
                trigger={(
                  <Button variant="ghost" className="m-0 w-full items-center justify-start flex gap-4">
                    <LinkIcon />
                    <p>Add a link</p>
                  </Button>
                )}
              />
            </DropdownMenuItem>
            <DropdownMenuItem className="h-12" asChild>
              <CreateTagsDialog
                trigger={(
                  <Button variant="ghost" className="m-0 w-full items-center justify-start flex gap-4">
                    <TagIcon />
                    <p>Add tags</p>
                  </Button>
                )}
              />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
