// import { useTopBar } from '@/contexts/topbar/topbar-provider';
import { useEffect } from 'react';
import { useLinks } from '../hooks/links';
import { LinkSheet } from './link-sheet';

interface LinksListProps {
  tagsFilter?: string[];
}

export function LinksList({ tagsFilter }: LinksListProps = {}) {
  // const { selectedTab } = useTopBar();
  const { data: links, refetch } = useLinks({ tags: tagsFilter });

  const sortedLinks = links?.data?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsFilter]);

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 justify-items-center px-6">
      {sortedLinks?.map(link => (
        <li key={link.id}>
          <LinkSheet link={link} />
        </li>
      ))}
    </ul>
  );
}
