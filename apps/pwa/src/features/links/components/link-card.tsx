import type { LinkSchema } from '@kinl/codegen-api';
import fallbackImage from '@/assets/images/fallback-img.webp';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { LinkTagsList } from './link-tags-list';

interface LinkCardProps {
  link: LinkSchema;
  onClick?: () => void;
}

export function LinkCard({ link, onClick }: LinkCardProps) {
  return (
    <button
      className="max-w-72 w-full max-h-96 h-full rounded-2xl text-start"
      type="button"
      onClick={onClick}
    >
      <Card className="max-w-72 w-full max-h-96 h-full min-h-80 pt-0 shadow-2xl shadow-gray-300/5 hover:shadow-gray-300/10 hover:text-primary hover:bg-secondary/50">
        <CardContent className="flex-1 w-full p-0 rounded-xl">
          <div className="relative w-full h-full max-h-48 rounded-t-xl overflow-hidden">
            <img
              src={link.image || fallbackImage}
              alt={link.title} // TODO: empty alt attribute because it's a decorative image
              onError={(e) => {
                (e.target as HTMLImageElement).src = fallbackImage;
              }}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card via-card/75 to-transparent pointer-events-none" />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          {/* TODO: underline title on hover */}
          <h2 className="text-lg font-bold line-clamp-3">{link.title}</h2>
          <LinkTagsList tags={link.tags ?? []} />
        </CardFooter>
      </Card>
    </button>
  );
}
