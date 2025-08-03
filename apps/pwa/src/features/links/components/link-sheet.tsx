import type { LinkSchema } from '@kinl/codegen-api';
import { Edit2Icon, Link2Icon, NotebookIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router';
import fallBackImage from '@/assets/images/fallback-img.webp';
import { AlertButton } from '@/components/common/alert-button';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { useDeleteLink } from '../hooks/links';
import { EditLinkDialog } from './edit-link-dialog';
import { LinkCard } from './link-card';
import { LinkTagsList } from './link-tags-list';

interface LinkSheetProps {
  link: LinkSchema;
}

export function LinkSheet({ link }: LinkSheetProps) {
  const { mutate: deleteLink } = useDeleteLink();

  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <LinkCard link={link} onClick={() => setOpen(true)} />
      </SheetTrigger>
      <SheetContent className="min-w-screen sm:min-w-1/2 overflow-y-auto">
        <SheetHeader className="p-0">
          <div className="flex absolute top-4 left-4 gap-2">
            <Button variant="secondary" size="icon" asChild>
              <Link to={link.url} target="_blank" aria-label={link.title} className="hover:text-primary"><Link2Icon /></Link>
            </Button>
            <EditLinkDialog
              trigger={(
                <Button variant="secondary" size="icon" aria-label="Edit link">
                  <Edit2Icon />
                </Button>
              )}
              linkId={link.id}
              defaultValues={{ ...link, tags: link.tags?.map(t => t.name) }}
            />
            <AlertButton title="Delete link" description="Are you sure you want to delete this link?" onConfirm={() => deleteLink(link.id)} asChild>
              <Button variant="secondary" size="icon" aria-label="Delete link">
                <Trash2Icon className="text-destructive" />
              </Button>
            </AlertButton>
          </div>
          <img
            src={link.image || fallBackImage}
            alt=""
            className="w-full h-48 object-cover mb-4"
          />
          <div className="p-4 flex flex-col gap-2">
            <SheetTitle className="text-lg flex items-center gap-2 hover:underline">
              <Link to={link.url} target="_blank" className="hover:text-primary">{link.title}</Link>
              <Link2Icon className="text-muted-foreground w-4 h-4" />
            </SheetTitle>
            <SheetDescription>{link.description}</SheetDescription>
            <LinkTagsList tags={link.tags ?? []} displayAll />
          </div>
        </SheetHeader>
        <hr className="m-4 h-0.5 border-t-0 bg-muted-foreground/20" />
        <div className="h-full flex flex-col justify-center items-center gap-4">
          <div className="flex gap-2 text-muted-foreground">
            <NotebookIcon />
            There is no note for now...
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
