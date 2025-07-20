// import { useTopBar } from '@/contexts/topbar/topbar-provider';
import { useLinks } from '../hooks/links';
import { LinkCard } from './link-card';

export function LinksList() {
  // const { selectedTab } = useTopBar();
  const { data: links } = useLinks();

  const sortedLinks = links?.data?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 justify-items-center px-6">
      {sortedLinks?.map(link => (
        <li key={link.id}>
          <LinkCard link={link} />
        </li>
      ))}
    </ul>
  );
}
