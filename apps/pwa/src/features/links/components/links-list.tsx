// import { useTopBar } from '@/contexts/topbar/topbar-provider';
import { useLinks } from '../hooks/links';
import { LinkCard } from './link-card';

export function LinksList() {
  // const { selectedTab } = useTopBar();
  const { data: links } = useLinks();

  return (
    <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 justify-items-center px-6">
      {links?.data?.map(link => (
        <LinkCard key={link.id} link={link} />
      ))}
    </div>
  );
}
