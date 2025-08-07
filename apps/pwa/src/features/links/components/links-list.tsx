// import { useTopBar } from '@/contexts/topbar/topbar-provider';
import { useEffect, useMemo } from 'react';
import { useTopBar } from '@/contexts/topbar/topbar-provider';
import { useLinks } from '../hooks/links';
import { LinkSheet } from './link-sheet';

interface LinksListProps {
  tagsFilter?: string[];
}

export function LinksList({ tagsFilter }: LinksListProps = {}) {
  const { search } = useTopBar();
  const { data: links, refetch } = useLinks({ tags: tagsFilter });

  const sortedLinks = links?.data?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  const filteredLinks = useMemo(() => {
    if (!search) {
      return sortedLinks;
    }

    return sortedLinks?.filter((link) => {
      const titleInclude = link.title?.toLowerCase().includes(search.toLowerCase());
      const tagsInclude = link.tags?.some(tag => tag.name.toLowerCase().includes(search.toLowerCase()));
      return titleInclude || tagsInclude;
    });
  }, [search, sortedLinks]);

  useEffect(() => {
    refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tagsFilter]);

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 justify-items-center px-6">
      {filteredLinks?.map(link => (
        <li key={link.id}>
          <LinkSheet link={link} />
        </li>
      ))}
    </ul>
  );
}
