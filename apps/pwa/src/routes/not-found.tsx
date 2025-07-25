import { NavLink } from 'react-router';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <main className="flex min-h-screen w-full justify-center bg-background">
      <div className="flex flex-col items-center justify-center gap-12 h-screen">
        <div className="flex flex-row items-center justify-center gap-6">
          <div className="text-center">
            <h1 className="text-8xl font-bold">404</h1>
            <p className="text-2xl">Page not found</p>
          </div>
        </div>
        <Button variant="outline">
          <NavLink to="/" className="text-primary">
            Go back home
          </NavLink>
        </Button>
      </div>
    </main>
  );
}
