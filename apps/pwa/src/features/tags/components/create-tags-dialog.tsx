import type { CreateTagsSchema } from '@kinl/codegen-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { zCreateTagsSchema } from '@kinl/codegen-api';
import { useForm } from 'react-hook-form';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormField } from '@/components/ui/form';
import { AddTagInput } from './add-tag-input';

interface CreateTagsDialogProps {
  trigger: React.ReactNode;
}

const i18nCreateTagsSchema = zCreateTagsSchema.extend({
  names: z.array(z.string().min(2, { message: 'name_must_be_longer_than_2' })),
});

export function CreateTagsDialog({ trigger }: CreateTagsDialogProps) {
  const form = useForm<CreateTagsSchema>({
    resolver: zodResolver(i18nCreateTagsSchema),
    defaultValues: {
      names: ['bonsoir', 'tous'],
    },
  });

  const onSubmit = (data: CreateTagsSchema) => {
    // eslint-disable-next-line no-console
    console.log(data);
    // createTags(data);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create tags</DialogTitle>
          <DialogDescription>You can create multiple tags at once</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Form {...form}>
              <FormField
                control={form.control}
                name="names"
                render={({ field }) => (
                  <AddTagInput
                    onChange={field.onChange}
                  />
                )}
              />
            </Form>
            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit">Create tags</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
