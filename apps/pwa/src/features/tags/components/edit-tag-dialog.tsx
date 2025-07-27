import type { TagSchema, UpdateTagSchema } from '@kinl/codegen-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { zUpdateTagSchema } from '@kinl/codegen-api';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { I18nFormMessage } from '@/components/ui/i18n-form-message';
import { Input } from '@/components/ui/input';
import { useUpdateTag } from '../hooks/tags';

interface EditTagDialogProps {
  tag: TagSchema;
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const i18nUpdateTagSchema = zUpdateTagSchema.extend({
  name: z.string().min(2, 'tags.card.actions.update.form.errors.invalid_name'),
});

export function EditTagDialog({ tag, trigger, open, onOpenChange }: EditTagDialogProps) {
  const { t } = useTranslation();
  const { mutate: updateTag } = useUpdateTag({ onSuccess: () => onOpenChange?.(false) });

  const form = useForm({
    resolver: zodResolver(i18nUpdateTagSchema),
    defaultValues: {
      name: tag.name,
    },
  });

  const onSubmit = (data: UpdateTagSchema) => {
    updateTag({ tagId: tag.id, data });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {
        trigger && (
          <DialogTrigger asChild>
            {trigger}
          </DialogTrigger>
        )
      }
      <DialogContent className="flex flex-col gap-4">
        <DialogHeader>
          <DialogTitle>{t('tags.card.actions.update.title')}</DialogTitle>
          <DialogDescription>{t('tags.card.actions.update.description')}</DialogDescription>
        </DialogHeader>
        <form>
          <Form {...form}>
            <FormField
              control={form.control}
              name="name"
              render={
                ({ field }) => (
                  <FormItem>
                    <FormLabel>{t('tags.card.actions.update.form.name')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('tags.card.actions.update.form.name')} />
                    </FormControl>
                    <I18nFormMessage />
                  </FormItem>
                )
              }
            />
          </Form>
          <DialogFooter className="pt-6">
            <DialogClose asChild>
              <Button variant="outline" type="button">
                {t('tags.card.actions.update.form.cancel')}
              </Button>
            </DialogClose>
            <Button type="submit" onClick={form.handleSubmit(onSubmit)}>
              {t('tags.card.actions.update.form.submit')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
