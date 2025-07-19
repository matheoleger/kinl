import type { LinkSchema } from '@kinl/codegen-api';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface LinkCardProps {
  link: LinkSchema;
}

export function LinkCard({ link }: LinkCardProps) {
  return (
    <Card className="max-w-72 w-full max-h-96 h-full min-h-80">
      <CardContent className="flex-1">
        <img src={link.image} alt={link.title} />
      </CardContent>
      <CardFooter>
        <h2 className="text-lg font-bold">{link.title}</h2>
        <ul>
          {/* TODO: add tags */}
        </ul>
      </CardFooter>
    </Card>
  );
}
