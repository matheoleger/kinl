import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagsInput, UpdateTagInput } from './contracts/tags.contract';
import { TagsHelper } from './tags.helper';

@Injectable()
export class TagsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagsHelper: TagsHelper,
  ) {}

  async getAllTags(userId: string) {
    return this.prisma.tag.findMany({ where: { ownerId: userId } });
  }

  async getAllPinnedTags(userId: string) {
    const pinnedTags = await this.prisma.pinnedTag.findMany({ where: { userId }, select: { tag: true } });

    return this.tagsHelper.mapPinnedTagsToSchema(pinnedTags);
  }

  async createMultipleTags(input: CreateTagsInput, userId: string) {
    await this.prisma.tag.createMany({
      data: input.names.map(name => ({
        name,
        ownerId: userId,
      })),
      skipDuplicates: true,
    });

    // We need to do this because of return type of createMany (it's not perfect because of the skipDuplicates)
    const createdTags = await this.prisma.tag.findMany({
      where: {
        ownerId: userId,
        name: { in: input.names },
      },
    });

    return createdTags;
  }

  async createPinnedTag(tagId: string, userId: string) {
    const pinnedTagCount = await this.prisma.pinnedTag.count({
      where: {
        userId,
      },
    });

    const pinnedTag = await this.prisma.pinnedTag.create({
      data: {
        tagId,
        userId,
        order: pinnedTagCount + 1,
      },
      select: {
        tag: true,
      },
    });

    return this.tagsHelper.mapPinnedTagToSchema(pinnedTag);
  }

  async deleteTag(tagId: string, userId: string) {
    const isUserOwner = this.getIsUserOwner(tagId, userId);

    if (!isUserOwner) {
      throw new ForbiddenException('you_cannot_delete_this_tag');
    }

    return this.prisma.tag.delete({
      where: {
        id: tagId,
      },
    });
  }

  async deletePinnedTag(tagId: string, userId: string) {
    return this.prisma.pinnedTag.delete({
      where: {
        userId_tagId: {
          userId,
          tagId,
        },
      },
    });
  }

  async updateTag(tagId: string, input: UpdateTagInput, userId: string) {
    const isUserOwner = this.getIsUserOwner(tagId, userId);

    if (!isUserOwner) {
      throw new ForbiddenException('you_cannot_update_this_tag');
    }

    const tagWithSameName = await this.prisma.tag.findFirst({
      where: {
        name: input.name,
        ownerId: userId,
      },
    });

    if (tagWithSameName) {
      throw new BadRequestException('tag_with_same_name_already_exists');
    }

    return this.prisma.tag.update({
      where: {
        id: tagId,
      },
      data: {
        ...input,
      },
    });
  }

  async getIsUserOwner(tagId: string, userId: string) {
    return !!(await this.prisma.tag.findFirst({
      where: {
        id: tagId,
        ownerId: userId,
      },
    }));
  }
}
