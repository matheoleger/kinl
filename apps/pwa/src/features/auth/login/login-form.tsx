import type { SignInSchema } from '@kinl/codegen-api';
import { zodResolver } from '@hookform/resolvers/zod';
import { zSignInSchema } from '@kinl/codegen-api';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useLogin } from '../hooks/auth';

export function LoginForm() {
  const { mutate: login } = useLogin();

  const form = useForm<SignInSchema>({
    resolver: zodResolver(zSignInSchema),
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
          Login
        </CardTitle>
        <CardDescription>
          Enter your email and password to access your workspace.
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...field} type="password" placeholder="Password" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <CardFooter className="flex-col gap-2">
              <Button type="submit">Login</Button>
            </CardFooter>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
