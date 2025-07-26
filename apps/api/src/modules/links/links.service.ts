import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import urlMetadata from 'url-metadata';
import { PrismaService } from '../prisma/prisma.service';
import { TagsService } from '../tags/tags.service';
import { CreateLinkInput, LinksFiltering, UpdateLinkInput } from './contracts/links.contract';
import { LinksHelper } from './links.helper';

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagsService: TagsService,
    private readonly linksHelper: LinksHelper,
  ) {}

  async getAllLinksFromUser(userId: string, filter?: LinksFiltering) {
    const filterByTags = filter?.filter(f => f.property === 'tags').map((f) => {
      return {
        tags: {
          some: {
            tag: {
              name: f.value,
            },
          },
        },
      };
    });

    const links = await this.prisma.link.findMany({
      where: {
        ownerId: userId,
        OR: filterByTags,
      },
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });

    const formattedLinks = this.linksHelper.mapLinksToSchema(links);

    return formattedLinks;

    return this.prisma.link.findMany({
      where: {
        ownerId: userId,
      },
    });
  }

  async createLink(input: CreateLinkInput, userId: string) {
    const metadata = await this.getMetadataFromUrl(input.url);

    try {
      const formattedMetadata = metadata
        ? {
            title: metadata.title || metadata['og:title'],
            description: metadata.description || metadata['og:description'],
            image: metadata.image || metadata['og:image'],
          }
        : {
            title: input.url,
            description: '',
            image: '',
          };

      const { tags: tagsNames, ...data } = input;

      // createMultipleTags returns the created tags and already created tags with same name as input
      const tags = tagsNames ? await this.tagsService.createMultipleTags({ names: tagsNames }, userId) : [];

      const createdLink = await this.prisma.link.create({
        data: {
          ...formattedMetadata,
          ...data,
          generated: false,
          ownerId: userId,
          tags: {
            createMany: {
              data: tags.map(t => ({ tagId: t.id })),
              skipDuplicates: true,
            },
          },
        },
        include: {
          tags: {
            select: {
              tag: true,
            },
          },
        },
      });

      return this.linksHelper.mapLinkToSchema(createdLink);
    }
    catch {
      throw new InternalServerErrorException('error_creating_link');
    }
  }

  async getMetadataFromUrl(url: string) {
    try {
      const metadata = await urlMetadata(url);
      return metadata;
    }
    catch {
      return null;
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

    const { tags: tagsNames, ...data } = input;

    // createMultipleTags returns the created tags and already created tags with same name as input
    const tags = tagsNames ? await this.tagsService.createMultipleTags({ names: tagsNames }, userId) : [];

    const updatedLink = await this.prisma.link.update({
      where: {
        id: linkId,
      },
      data: {
        ...data,
        tags: {
          createMany: {
            data: tags.map(t => ({ tagId: t.id })),
            skipDuplicates: true,
          },
          deleteMany: {
            tagId: {
              notIn: tags.map(t => t.id),
            },
          },
        },
      },
      include: {
        tags: {
          select: {
            tag: true,
          },
        },
      },
    });

    return this.linksHelper.mapLinkToSchema(updatedLink);
  }

  async deleteLink(linkId: string, userId: string) {
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
        id: linkId,
        ownerId: userId,
      },
    });
  }
}
