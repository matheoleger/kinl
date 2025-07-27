import type { TagSchema } from '@kinl/codegen-api';
import { Edit2Icon, EllipsisVerticalIcon, EyeIcon, PinIcon, PinOffIcon, Trash2Icon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink } from 'react-router';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { useCreatePinnedTag, useDeletePinnedTag, usePinnedTags } from '../hooks/pinned-tags';
import { useDeleteTag } from '../hooks/tags';
import { EditTagDialog } from './edit-tag-dialog';

export function TagActionDropdown({ tag }: { tag: TagSchema }) {
  const { t } = useTranslation();

  const { mutate: deleteTag } = useDeleteTag();
  const { mutate: createPinnedTag } = useCreatePinnedTag();
  const { mutate: deletePinnedTag } = useDeletePinnedTag();
  const { data: pinnedTags } = usePinnedTags();

  const [alertDeleteOpen, setAlertDeleteOpen] = useState(false);
  const [alertEditOpen, setAlertEditOpen] = useState(false);

  const onDeleteConfirm = () => {
    deleteTag(tag.id);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0 pointer-events-auto"
          >
            <EllipsisVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <NavLink to={`/links?tags=${tag.name}`}>
              <EyeIcon />
              View
            </NavLink>
          </DropdownMenuItem>
          {
            !pinnedTags?.some(t => t.id === tag.id)
              ? (
                  <DropdownMenuItem onSelect={() => createPinnedTag(tag.id)}>
                    <PinIcon />
                    Pin tag
                  </DropdownMenuItem>
                )
              : (
                  <DropdownMenuItem onSelect={() => deletePinnedTag(tag.id)}>
                    <PinOffIcon />
                    Unpin tag
                  </DropdownMenuItem>
                )
          }
          <DropdownMenuItem onSelect={() => setAlertEditOpen(true)}>
            <Edit2Icon />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => setAlertDeleteOpen(true)} className="text-destructive">
            <Trash2Icon className="text-destructive" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialog open={alertDeleteOpen} onOpenChange={setAlertDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('tags.card.actions.delete.title')}</AlertDialogTitle>
            <AlertDialogDescription>{t('tags.card.actions.delete.description')}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={onDeleteConfirm}>
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <EditTagDialog tag={tag} onOpenChange={setAlertEditOpen} open={alertEditOpen} />
    </>
  );
}
