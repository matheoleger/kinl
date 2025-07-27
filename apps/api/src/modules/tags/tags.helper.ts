import { Injectable } from '@nestjs/common';
import { Prisma } from 'prisma/generated/client';
import { Tag, Tags } from './contracts/tags.contract';

type PrismaTag = Prisma.PinnedTagGetPayload<{
  select: {
    tag: true;
  };
}>;

@Injectable()
export class TagsHelper {
  mapPinnedTagsToSchema(pinnedTags: PrismaTag[]): Tags {
    return pinnedTags.map(pinnedTag => ({
      ...pinnedTag.tag,
    }));
  }

  mapPinnedTagToSchema(pinnedTag: PrismaTag): Tag {
    return {
      ...pinnedTag.tag,
    };
  }
}
