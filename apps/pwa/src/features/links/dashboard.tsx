import { Button } from '@/components/ui/button';
import { useLinks } from './hooks/links';

export function Dashboard() {
  // TODO: improve this (just for testing here)
  const { data: links } = useLinks();

  return (
    <main className="flex items-center justify-center pt-16 pb-4 h-screen">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <div className="max-w-[300px] w-full space-y-6 px-4">
          {links?.data?.map(link => (
            <Button key={link.id}>{link.url}</Button>
          ))}
          <Button>
            This button do nothing
          </Button>
        </div>
      </div>
    </main>
  );
}
