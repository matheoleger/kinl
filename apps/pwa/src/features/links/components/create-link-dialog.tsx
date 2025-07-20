import type { CreateLinkSchema } from '@kinl/codegen-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { zCreateLinkSchema } from '@kinl/codegen-api';
import { CircleQuestionMarkIcon } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { I18nFormMessage } from '@/components/ui/i18n-form-message';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useCreateLink } from '../hooks/links';

interface CreateLinkDialogProps {
  trigger: React.ReactNode;
}

const i18nCreateLinkSchema = zCreateLinkSchema.extend({
  url: z.string().url('links.create_link_dialog.form.errors.invalid_url'),
});

export function CreateLinkDialog({ trigger }: CreateLinkDialogProps) {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  const { mutate: createLink } = useCreateLink({
    onSuccess: () => setOpen(false),
  });

  const form = useForm<CreateLinkSchema>({
    resolver: zodResolver(i18nCreateLinkSchema),
    defaultValues: {
      url: '',
      title: '',
      description: '',
    },
  });

  const onSubmit = (data: CreateLinkSchema) => {
    createLink(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t('links.create_link_dialog.title')}
          </DialogTitle>
          <DialogDescription>{t('links.create_link_dialog.description')}</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('links.create_link_dialog.form.url')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('links.create_link_dialog.form.url')} />
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
                    <FormLabel>{t('links.create_link_dialog.form.title')}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={t('links.create_link_dialog.form.title')} />
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
                    <FormLabel>{t('links.create_link_dialog.form.description')}</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder={t('links.create_link_dialog.form.description')} />
                    </FormControl>
                    <I18nFormMessage />
                  </FormItem>
                )}
              />
              <DialogDescription className="flex justify-center items-center gap-2">
                <CircleQuestionMarkIcon size={24} />
                {t('links.create_link_dialog.form.information')}
              </DialogDescription>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">{t('links.create_link_dialog.form.cancel')}</Button>
                </DialogClose>
                <Button type="submit">{t('links.create_link_dialog.form.submit')}</Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
