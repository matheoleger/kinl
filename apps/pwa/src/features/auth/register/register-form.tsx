import type { RegisterSchema } from '@kinl/codegen-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { zRegisterSchema } from '@kinl/codegen-api';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { I18nFormMessage } from '@/components/ui/i18n-form-message';
import { Input } from '@/components/ui/input';
import { useRegister } from '../hooks/auth';

// We need to duplicate password schema because of refine options... (also error messages)
const passwordSchema = z
  .string()
  .min(8, { message: 'auth.register.form.errors.password_must_be_at_least_8_characters_long' })
  .refine(password => /[A-Z]/.test(password), {
    message: 'auth.register.form.errors.password_must_contain_at_least_one_uppercase_letter',
  })
  .refine(password => /[a-z]/.test(password), {
    message: 'auth.register.form.errors.password_must_contain_at_least_one_lowercase_letter',
  })
  .refine(password => /\d/.test(password), { message: 'auth.register.form.errors.password_must_contain_at_least_one_digit' })
  .refine(password => /[!@#$%^&*]/.test(password), {
    message: 'auth.register.form.errors.password_must_contain_at_least_one_special_character',
  });

const i18nRegisterSchema = zRegisterSchema.extend({
  email: z.string().email('auth.register.form.errors.invalid_email'),
  username: z.string().min(3, { message: 'auth.register.form.errors.username_must_be_at_least_3_characters_long' }),
  password: passwordSchema,
  confirmPassword: z.string(),
})
  .refine(data => data.password === data.confirmPassword, {
    message: 'auth.register.form.errors.passwords_must_match',
    path: ['confirmPassword'],
  });

export function RegisterForm() {
  const { t } = useTranslation();

  const { mutate: register } = useRegister();

  const form = useForm<z.infer<typeof i18nRegisterSchema>>({
    resolver: zodResolver(i18nRegisterSchema),
    defaultValues: {
      email: '',
      username: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: RegisterSchema) => {
    register(data);
  };

  return (
    <Card className="w-full max-w-sm backdrop-blur-md bg-card/60">
      <CardHeader>
        <CardTitle className="text-xl">
          {t('auth.register.title')}
        </CardTitle>
        <CardDescription>
          {t('auth.register.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.register.form.username')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('auth.register.form.username')} />
                  </FormControl>
                  <I18nFormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.register.form.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('auth.register.form.email')} />
                  </FormControl>
                  <I18nFormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.register.form.password')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder={t('auth.register.form.password')} />
                  </FormControl>
                  <I18nFormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.register.form.confirmPassword')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder={t('auth.register.form.confirmPassword')} />
                  </FormControl>
                  <I18nFormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="flex-col gap-2">
              <Button type="submit">{t('auth.register.form.submit')}</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
