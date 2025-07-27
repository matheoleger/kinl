import type { RouteConfig } from '@react-router/dev/routes';
import { index, layout, route } from '@react-router/dev/routes';

export default [
  layout('routes/main/layout.tsx', [
    index('routes/main/dashboard.tsx'),
    route('tags', 'routes/main/tags.tsx'),
    route('links', 'routes/main/links.tsx'),
  ]),
  layout('routes/auth/layout.tsx', [
    route('login', 'routes/auth/login.tsx'),
    route('register', 'routes/auth/register.tsx'),
  ]),
  route('*', 'routes/not-found.tsx'),
] satisfies RouteConfig;
