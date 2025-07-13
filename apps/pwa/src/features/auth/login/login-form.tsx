import type { SignInSchema } from '@kinl/codegen-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { zSignInSchema } from '@kinl/codegen-api';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form';
import { I18nFormMessage } from '@/components/ui/i18n-form-message';
import { Input } from '@/components/ui/input';
import { useLogin } from '../hooks/auth';

const i18nloginSchema = zSignInSchema.extend({
  email: z.string().email('auth.login.form.errors.invalid_email'),
  password: z.string().min(8, { message: 'auth.login.form.errors.password_must_be_at_least_8_characters_long' }),
});

export function LoginForm() {
  const { t } = useTranslation();

  const { mutate: login } = useLogin();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(i18nloginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: SignInSchema) => {
    login(data);
  };

  return (
    <Card className="w-full max-w-sm backdrop-blur-md bg-card/60">
      <CardHeader>
        <CardTitle className="text-xl">
          {t('auth.login.title')}
        </CardTitle>
        <CardDescription>
          {t('auth.login.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('auth.login.form.email')}</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder={t('auth.login.form.email')} />
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
                  <FormLabel>{t('auth.login.form.password')}</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder={t('auth.login.form.password')} />
                  </FormControl>
                  <I18nFormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="flex-col gap-2">
              <Button type="submit">{t('auth.login.form.submit')}</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
