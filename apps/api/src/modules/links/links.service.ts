import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import urlMetadata from 'url-metadata';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkInput, UpdateLinkInput } from './contracts/links.contract';

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getAllLinksFromUser(userId: string) {
    return this.prisma.link.findMany({
      where: {
        ownerId: userId,
      },
    });
  }

  async createLink(input: CreateLinkInput, userId: string) {
    const metadata = await urlMetadata(input.url);

    try {
      const formattedMetadata = {
        title: metadata.title || metadata['og:title'],
        description: metadata.description || metadata['og:description'],
        image: metadata.image || metadata['og:image'],
      };

      return this.prisma.link.create({
        data: {
          ...formattedMetadata,
          ...input,
          generated: false,
          ownerId: userId,
        },
      });
    }
    catch {
      throw new InternalServerErrorException('error_creating_link');
    }
  }

  async updateLink(input: UpdateLinkInput, linkId: string, userId: string) {
    const isUserOwner = await this.prisma.link.findUnique({
      where: {
        id: linkId,
        ownerId: userId,
      },
    });

    if (!isUserOwner) {
      throw new ForbiddenException('you_cannot_update_this_link');
    }

    return this.prisma.link.update({
      where: {
        id: linkId,
      },
      data: {
        ...input,
      },
    });
  }

  async deleteLink(userId: string, linkId: string) {
    const isUserOwner = await this.prisma.link.findUnique({
      where: {
        id: linkId,
        ownerId: userId,
      },
    });

    if (!isUserOwner) {
      throw new ForbiddenException('you_cannot_delete_this_link');
    }

    return this.prisma.link.deleteMany({
      where: {
        ownerId: userId,
      },
    });
  }
}
