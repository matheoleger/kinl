import { LinkIcon, PlusIcon, TagIcon } from 'lucide-react';
import { CreateLinkDialog } from '@/features/links/components/create-link-dialog';
import { CreateTagsDialog } from '@/features/tags/components/create-tags-dialog';
import { Button } from '../ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';

export function AddDialog({ mobile }: { mobile?: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className={mobile ? 'w-12 h-12 rounded-lg' : ''}>
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
  );
}
