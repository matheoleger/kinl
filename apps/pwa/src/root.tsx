import { QueryClientProvider } from '@tanstack/react-query';
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from 'react-router';

import { Toaster } from 'sonner';
import AuthProvider from './contexts/auth/auth-provider';
import { queryClient } from './lib/query-client';
import './lib/i18n.ts';
import './app.css';

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>kinL</title>
        <link rel="icon" href="/favicon.ico" />
        <Meta />
        <Links />
      </head>
      <body className="dark">
        {children}
        <ScrollRestoration />
        <Scripts />
        <Toaster invert />
      </body>
    </html>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  );
}
