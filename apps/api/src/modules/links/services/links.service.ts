import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import urlMetadata from 'url-metadata';
import { PrismaService } from '../../prisma/prisma.service';
import { TagsService } from '../../tags/tags.service';
import { CreateLinkInput, LinksFiltering, UpdateLinkInput } from '../contracts/links.contract';
import { LinksHelper } from '../links.helper';
import { UrlValidationService } from './url-validation.service';

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly tagsService: TagsService,
    private readonly linksHelper: LinksHelper,
    private readonly urlValidationService: UrlValidationService,
  ) {}

  async getAllLinksFromUser(userId: string, filter?: LinksFiltering) {
    const filterTags = filter?.find(f => f.property === 'tags');

    const filterByTags = this.linksHelper.parseFilterTags(filterTags?.value);

    const links = await this.prisma.link.findMany({
      where: {
        ownerId: userId,
        AND: filterByTags,
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
  }

  async createLink(input: CreateLinkInput, userId: string) {
    const metadata = await this.getMetadataFromUrl(input.url);
    const metadataImage = metadata?.image || metadata?.['og:image'];
    const image = this.urlValidationService.isValidUrl(metadataImage) ? metadataImage : undefined;

    try {
      // TODO: SSRF vulnerability here => isValidUrl
      const formattedMetadata = metadata
        ? {
            title: metadata.title || metadata['og:title'],
            description: metadata.description || metadata['og:description'],
            image,
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

  async updateLink(input: UpdateLinkInput, linkId: string, userId: string) {
    const isUserOwner = this.getIsUserOwner(linkId, userId);

    if (!isUserOwner) {
      throw new ForbiddenException('you_cannot_update_this_link');
    }

    const { tags: tagsNames, ...data } = input;

    const metadata = data.url ? await this.getMetadataFromUrl(data.url) : null;
    const metadataImage = metadata?.image || metadata?.['og:image'];
    const image = this.urlValidationService.isValidUrl(metadataImage) ? metadataImage : undefined;

    // createMultipleTags returns the created tags and already created tags with same name as input
    const tags = tagsNames ? await this.tagsService.createMultipleTags({ names: tagsNames }, userId) : [];

    const updatedLink = await this.prisma.link.update({
      where: {
        id: linkId,
      },
      data: {
        ...data,
        image,
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

  async getMetadataFromUrl(url: string) {
    try {
      const metadata = await urlMetadata(url);
      return metadata;
    }
    catch {
      return null;
    }
  }

  async deleteLink(linkId: string, userId: string) {
    const isUserOwner = this.getIsUserOwner(linkId, userId);

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

  async getIsUserOwner(linkId: string, userId: string) {
    return !!(await this.prisma.link.findFirst({
      where: {
        id: linkId,
        ownerId: userId,
      },
    }));
  }
}
