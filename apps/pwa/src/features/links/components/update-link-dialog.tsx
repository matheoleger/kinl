import type { UpdateLinkSchema } from '@kinl/codegen-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { zUpdateLinkSchema } from '@kinl/codegen-api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { I18nFormMessage } from '@/components/ui/i18n-form-message';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useUpdateLink } from '../hooks/links';

interface UpdateLinkDialogProps {
  trigger: React.ReactNode;
  linkId: string;
  defaultValues: UpdateLinkSchema;
}

const i18nUpdateLinkSchema = zUpdateLinkSchema.extend({
  url: z.string().url('links.update_link_dialog.form.errors.invalid_url').optional(),
  title: z.string().min(2, 'links.update_link_dialog.form.errors.invalid_title').optional(),
});

export function UpdateLinkDialog({
  trigger,
  linkId,
  defaultValues,
}: UpdateLinkDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const { mutate: updateLink } = useUpdateLink({
    onSuccess: () => setOpen(false),
  });

  const form = useForm<UpdateLinkSchema>({
    resolver: zodResolver(i18nUpdateLinkSchema),
    defaultValues,
  });

  const onSubmit = (data: UpdateLinkSchema) => {
    updateLink({ id: linkId, data });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{t('links.update_link_dialog.title')}</DialogTitle>
          <DialogDescription>
            {t('links.update_link_dialog.description')}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-6"
            >
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('links.update_link_dialog.form.url')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t(
                          'links.update_link_dialog.form.url',
                        )}
                      />
                    </FormControl>
                    <I18nFormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('links.update_link_dialog.form.title')}
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder={t(
                          'links.update_link_dialog.form.title',
                        )}
                      />
                    </FormControl>
                    <I18nFormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {t('links.update_link_dialog.form.description')}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder={t(
                          'links.update_link_dialog.form.description',
                        )}
                      />
                    </FormControl>
                    <I18nFormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">
                    {t('links.update_link_dialog.form.cancel')}
                  </Button>
                </DialogClose>
                <Button type="submit">
                  {t('links.update_link_dialog.form.submit')}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
