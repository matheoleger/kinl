import { LinkIcon, PlusIcon, TagIcon } from 'lucide-react';
import { useTopBar } from '@/contexts/topbar/topbar-provider';
import { TabsValue } from '@/contexts/topbar/types';
import { CreateLinkDialog } from '@/features/links/components/create-link-dialog';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Tabs, TabsList, TabsTrigger } from './ui/tabs';

export function MainTopbar() {
  const { selectedTab, setSelectedTab } = useTopBar();

  return (
    <div className="w-full h-14 rounded-md flex flex-row items-center px-2 justify-between sticky top-0 bg-background z-10">
      <div className="flex flex-row items-center gap-4">
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
      <div className="flex flex-row items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
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
              <Button variant="ghost" className="m-0 w-full items-center justify-start flex gap-4">
                <TagIcon />
                <p>Add tags</p>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
