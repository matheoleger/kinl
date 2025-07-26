import type { TagsSchema } from '@kinl/codegen-api';
import { Badge } from '@/components/ui/badge';

interface LinkTagsListProps {
  tags: TagsSchema;
  displayLimit?: number;
  displayAll?: boolean;
}

export function LinkTagsList({ tags, displayLimit = 3, displayAll = false }: LinkTagsListProps) {
  if (!displayAll && tags?.length > displayLimit) {
    return (
      <ul className="flex flex-wrap gap-2">
        {
          tags?.slice(0, displayLimit).map(tag => (
            <li key={tag.id}>
              <Badge variant="secondary" className="text-xs px-2">{tag.name}</Badge>
            </li>
          ))
        }
        <li>
          <Badge variant="secondary" className="text-xs px-2">
            +
            {tags?.length - displayLimit}
          </Badge>
        </li>
      </ul>
    );
  }
  else {
    return (
      <ul className="flex flex-wrap gap-2">
        {
          tags?.map(tag => (
            <li key={tag.id}>
              <Badge variant="secondary" className="text-xs px-2">{tag.name}</Badge>
            </li>
          ))
        }
      </ul>
    );
  }
}
