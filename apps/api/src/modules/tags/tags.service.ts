import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTagsInput, UpdateTagInput } from './contracts/tags.contract';

@Injectable()
export class TagsService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getAllTags(userId: string) {
    return this.prisma.tag.findMany({ where: { ownerId: userId } });
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

  async deleteTag(tagId: string) {
    return this.prisma.tag.delete({
      where: {
        id: tagId,
      },
    });
  }

  async updateTag(tagId: string, input: UpdateTagInput) {
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
