import type { TagSchema } from '@kinl/codegen-api';
import { TagIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Card } from '@/components/ui/card';
import { TagActionDropdown } from './tag-action-dropdown';

interface TagCardProps {
  tag: TagSchema;
}

export function TagCard({ tag }: TagCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="flex flex-row justify-between items-center gap-4 p-4 w-full hover:text-primary hover:bg-secondary/50"
      onClick={() => {
        navigate(`/tags/${tag.id}`);
      }}
    >
      <div className="flex flex-row gap-4 w-full pl-2">
        <TagIcon />
        <p
          className="overflow-hidden text-ellipsis whitespace-nowrap w-28"
        >
          {tag.name}
        </p>
      </div>
      <div onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
      >
        <TagActionDropdown tag={tag} />
      </div>
    </Card>
  );
}
