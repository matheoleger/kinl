import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated/client';
import { Link, Links } from './contracts/links.contract';

type PrismaLink = Prisma.LinkGetPayload<{
  include: {
    tags: {
      select: {
        tag: true;
      };
    };
  };
}>;

@Injectable()
export class LinksHelper {
  mapLinksToSchema(links: PrismaLink[]): Links {
    return links.map(link => ({
      ...link,
      description: link.description || undefined,
      image: link.image || undefined,
      tags: link.tags.map(t => (t.tag)),
    }));
  }

  mapLinkToSchema(link: PrismaLink): Link {
    return {
      ...link,
      description: link.description || undefined,
      image: link.image || undefined,
      tags: link.tags.map(t => (t.tag)),
    };
  }
}
