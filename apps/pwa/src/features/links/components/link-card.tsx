import type { LinkSchema } from '@kinl/codegen-api';
import logo from '@/assets/logo/logo-color.svg';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';

interface LinkCardProps {
  link: LinkSchema;
}

export function LinkCard({ link }: LinkCardProps) {
  const onLinkClick = () => {};

  return (
    <button
      className="max-w-72 w-full max-h-96 h-full focus:outline-none focus-visible:border-ring focus-visible:ring-ring/70 focus-visible:ring-[3px] rounded-2xl text-start"
      onClick={onLinkClick}
    >
      <Card className="max-w-72 w-full max-h-96 h-full min-h-80 pt-0 shadow-2xl shadow-gray-300/10 hover:shadow-gray-300/15 hover:text-primary hover:bg-secondary/50">
        <CardContent className="flex-1 w-full p-0 rounded-xl">
          {/* <img
            // src={link.image}
            src={"https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
            alt={link.title}
            onError={e => (e.target as HTMLImageElement).src = logo}
            className="w-full h-full max-h-48 object-cover rounded-t-xl"
          /> */}
          <div className="relative w-full h-full max-h-48 rounded-t-xl overflow-hidden">
            <img
              src={link.image}
              // src={"https://images.unsplash.com/photo-1482881497185-d4a9ddbe4151?q=80&w=765&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
              alt={link.title}
              onError={e => (e.target as HTMLImageElement).src = logo}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-card via-card/75 to-transparent pointer-events-none" />
          </div>
        </CardContent>
        <CardFooter className="flex-col items-start gap-2">
          <h2 className="text-lg font-bold">{link.title}</h2>
          <ul className="flex flex-wrap gap-2">
            {/* TODO: add tags */}
            <li>
              <Badge variant="secondary" className="text-xs px-2">tag</Badge>
            </li>
            <li>
              <Badge variant="secondary" className="text-xs px-2">tag</Badge>
            </li>
            <li>
              <Badge variant="secondary" className="text-xs px-2">tag</Badge>
            </li>
          </ul>
        </CardFooter>
      </Card>
    </button>
  );
}
