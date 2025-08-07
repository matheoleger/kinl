import { useMemo } from 'react';
import { useTopBar } from '@/contexts/topbar/topbar-provider';
import { useTags } from '../hooks/tags';
import { TagCard } from './tag-card';

export function TagsList() {
  const { search } = useTopBar();
  const { data: tags } = useTags();

  const filteredTags = useMemo(() => {
    if (!search) {
      return tags;
    }

    return tags?.filter(tag => tag.name.toLowerCase().includes(search.toLowerCase()));
  }, [search, tags]);

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 justify-items-center px-6">
      {
        filteredTags?.map(tag => (
          <li key={tag.id} className="w-full">
            <TagCard tag={tag} />
          </li>
        ))
      }
    </ul>
  );
}
