import { useTags } from '../hooks/tags';
import { TagCard } from './tag-card';

export function TagsList() {
  const { data: tags } = useTags();

  return (
    <ul className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4 justify-items-center px-6">
      {
        tags?.map(tag => (
          <li key={tag.id} className="w-full">
            <TagCard tag={tag} />
          </li>
        ))
      }
    </ul>
  );
}
