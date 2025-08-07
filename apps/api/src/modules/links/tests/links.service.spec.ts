import { faker } from '@faker-js/faker';
import { FilterRule } from '@lonestone/nzoth/server';
import { Test, TestingModule } from '@nestjs/testing';
import { DeepMockProxy, mockDeep } from 'jest-mock-extended';
import { PrismaClient } from 'prisma/generated/client';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { TagsService } from 'src/modules/tags/tags.service';
import { LinksHelper } from '../links.helper';
import { LinksService } from '../services/links.service';
import { UrlValidationService } from '../services/url-validation.service';
import { generateTestLink } from './links-test.utils';

describe('linksService', () => {
  let service: LinksService;
  let tagsService: jest.Mocked<TagsService>;
  let linksHelper: jest.Mocked<LinksHelper>;
  let urlValidationService: jest.Mocked<UrlValidationService>;

  let prismaMock: DeepMockProxy<PrismaClient>;

  const mockLink = generateTestLink();

  beforeEach(async () => {
    prismaMock = mockDeep<PrismaClient>();

    const mockTagsService = {
      createMultipleTags: jest.fn(),
    };

    const mockLinksHelper = {
      mapLinksToSchema: jest.fn(),
      mapLinkToSchema: jest.fn(),
      parseFilterTags: jest.fn(),
    };

    const mockUrlValidationService = {
      isValidUrl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LinksService,
        { provide: PrismaService, useValue: prismaMock },
        { provide: TagsService, useValue: mockTagsService },
        { provide: LinksHelper, useValue: mockLinksHelper },
        { provide: UrlValidationService, useValue: mockUrlValidationService },
      ],
    }).compile();

    service = module.get<LinksService>(LinksService);
    tagsService = module.get(TagsService);
    linksHelper = module.get(LinksHelper);
    urlValidationService = module.get(UrlValidationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllLinksFromUser', () => {
    const userId = faker.string.uuid();
    const mockTag = { id: faker.string.uuid(), name: 'test' };
    const mockLinkWithTags = {
      ...mockLink,
      tags: [{ tag: mockTag }],
    };
    const expectedMappedLinks = [
      {
        ...mockLink,
        tags: [mockTag],
        description: mockLink.description || undefined,
        image: mockLink.image || undefined,
      },
    ];

    it('should return all links for a user without filters', async () => {
      prismaMock.link.findMany.mockResolvedValue([mockLinkWithTags]);
      linksHelper.parseFilterTags.mockReturnValue([]);
      linksHelper.mapLinksToSchema.mockReturnValue(expectedMappedLinks);

      const result = await service.getAllLinksFromUser(userId);

      expect(prismaMock.link.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: userId,
          AND: [],
        },
        include: {
          tags: {
            select: { tag: true },
          },
        },
      });
      expect(linksHelper.mapLinksToSchema).toHaveBeenCalledWith([mockLinkWithTags]);
      expect(result).toEqual(expectedMappedLinks);
    });

    it('should return filtered links with tag filters', async () => {
      const filter = [{ property: 'tags' as const, rule: FilterRule.IN, value: '["test"]' }];
      const parsedFilters = [{ tags: { some: { tag: { name: 'test' } } } }];

      prismaMock.link.findMany.mockResolvedValue([mockLinkWithTags]);
      linksHelper.parseFilterTags.mockReturnValue(parsedFilters);
      linksHelper.mapLinksToSchema.mockReturnValue(expectedMappedLinks);

      const result = await service.getAllLinksFromUser(userId, filter);

      expect(linksHelper.parseFilterTags).toHaveBeenCalledWith('["test"]');
      expect(prismaMock.link.findMany).toHaveBeenCalledWith({
        where: {
          ownerId: userId,
          AND: parsedFilters,
        },
        include: {
          tags: {
            select: { tag: true },
          },
        },
      });
      expect(result).toEqual(expectedMappedLinks);
    });

    it('should handle empty result from database', async () => {
      prismaMock.link.findMany.mockResolvedValue([]);
      linksHelper.mapLinksToSchema.mockReturnValue([]);

      const result = await service.getAllLinksFromUser(userId);

      expect(result).toEqual([]);
    });
  });

  describe('createLink', () => {
    const userId = faker.string.uuid();
    const mockTags = [
      { id: faker.string.uuid(), name: faker.word.sample(), createdAt: new Date(), updatedAt: new Date(), ownerId: userId },
      { id: faker.string.uuid(), name: faker.word.sample(), createdAt: new Date(), updatedAt: new Date(), ownerId: userId },
    ];

    const mockMetadata = {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      image: faker.image.url(),
    };

    const prismaCreatedLink = {
      ...mockLink,
      tags: mockTags.map(tag => ({ tag })),
    };

    const mappedLink = {
      ...mockLink,
      tags: mockTags,
    };

    it('should create a link with metadata and tags', async () => {
      const createMockLinkInput = { url: faker.internet.url(), tags: [faker.word.sample()] };

      urlValidationService.isValidUrl.mockReturnValue(true);
      service.getMetadataFromUrl = jest.fn().mockResolvedValue(mockMetadata);
      tagsService.createMultipleTags.mockResolvedValue(mockTags);
      prismaMock.link.create.mockResolvedValue(prismaCreatedLink);
      linksHelper.mapLinkToSchema.mockReturnValue(mappedLink);

      const result = await service.createLink(createMockLinkInput, userId);

      expect(service.getMetadataFromUrl).toHaveBeenCalledWith(createMockLinkInput.url);
      expect(urlValidationService.isValidUrl).toHaveBeenCalledWith(mockMetadata.image);
      expect(tagsService.createMultipleTags).toHaveBeenCalledWith({ names: createMockLinkInput.tags }, userId);
      expect(prismaMock.link.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          url: createMockLinkInput.url,
          title: mockMetadata.title,
          description: mockMetadata.description,
          image: mockMetadata.image,
          ownerId: userId,
          tags: {
            createMany: {
              data: mockTags.map(t => ({ tagId: t.id })),
              skipDuplicates: true,
            },
          },
        }),
      }));
      expect(result).toEqual(mappedLink);
    });

    it('should fallback to default metadata if none is found', async () => {
      const createMockLinkInput = { url: faker.internet.url() };

      service.getMetadataFromUrl = jest.fn().mockResolvedValue(null);
      urlValidationService.isValidUrl.mockReturnValue(false);
      tagsService.createMultipleTags.mockResolvedValue([]);
      prismaMock.link.create.mockResolvedValue(prismaCreatedLink);
      linksHelper.mapLinkToSchema.mockReturnValue(mappedLink);

      const result = await service.createLink(createMockLinkInput, userId);

      expect(prismaMock.link.create).toHaveBeenCalled();
      expect(result).toEqual(mappedLink);
    });

    it('should choose input values over metadata', async () => {
      const createMockLinkInput = {
        url: faker.internet.url(),
        title: faker.lorem.sentence(),
        description: faker.lorem.paragraph(),
        tags: [faker.word.sample()],
      };

      urlValidationService.isValidUrl.mockReturnValue(true);
      service.getMetadataFromUrl = jest.fn().mockResolvedValue(mockMetadata);
      tagsService.createMultipleTags.mockResolvedValue(mockTags);
      prismaMock.link.create.mockResolvedValue(prismaCreatedLink);
      linksHelper.mapLinkToSchema.mockReturnValue(mappedLink);

      const result = await service.createLink(createMockLinkInput, userId);

      expect(service.getMetadataFromUrl).toHaveBeenCalledWith(createMockLinkInput.url);
      expect(urlValidationService.isValidUrl).toHaveBeenCalledWith(mockMetadata.image);
      expect(tagsService.createMultipleTags).toHaveBeenCalledWith({ names: createMockLinkInput.tags }, userId);
      expect(prismaMock.link.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          url: createMockLinkInput.url,
          title: createMockLinkInput.title,
          description: createMockLinkInput.description,
          image: mockMetadata.image,
          ownerId: userId,
          tags: {
            createMany: {
              data: mockTags.map(t => ({ tagId: t.id })),
              skipDuplicates: true,
            },
          },
        }),
      }));
      expect(result).toEqual(mappedLink);
    });

    it('should throw InternalServerErrorException on DB error', async () => {
      const createMockLinkInput = { url: faker.internet.url() };

      service.getMetadataFromUrl = jest.fn().mockResolvedValue(mockMetadata);
      urlValidationService.isValidUrl.mockReturnValue(true);
      tagsService.createMultipleTags.mockResolvedValue(mockTags);
      prismaMock.link.create.mockRejectedValue(new Error('DB error'));

      await expect(service.createLink(createMockLinkInput, userId)).rejects.toThrow('error_creating_link');
    });
  });

  describe('updateLink', () => {
    const userId = faker.string.uuid();
    const linkId = faker.string.uuid();

    const mockTags = [
      { id: faker.string.uuid(), name: faker.word.sample(), createdAt: new Date(), updatedAt: new Date(), ownerId: userId },
      { id: faker.string.uuid(), name: faker.word.sample(), createdAt: new Date(), updatedAt: new Date(), ownerId: userId },
    ];

    const mockMetadata = {
      title: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      image: faker.image.url(),
    };

    const mockUpdatedTags = [{ id: faker.string.uuid(), name: faker.word.sample(), createdAt: new Date(), updatedAt: new Date(), ownerId: userId }];

    const prismaUpdatedLink = {
      ...mockLink,
      tags: mockTags.map(tag => ({ tag })),
    };

    const mappedLink = {
      ...mockLink,
      tags: mockTags,
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should update a link if user is owner', async () => {
      const updateMockLinkInput = { url: faker.internet.url(), tags: [faker.word.sample()] };

      service.getIsUserOwner = jest.fn().mockResolvedValue(true);
      service.getMetadataFromUrl = jest.fn().mockResolvedValue(mockMetadata);
      urlValidationService.isValidUrl.mockReturnValue(true);
      tagsService.createMultipleTags.mockResolvedValue(mockUpdatedTags);
      prismaMock.link.update.mockResolvedValue(prismaUpdatedLink);
      linksHelper.mapLinkToSchema.mockReturnValue(mappedLink);

      const result = await service.updateLink(updateMockLinkInput, linkId, userId);

      expect(service.getIsUserOwner).toHaveBeenCalledWith(linkId, userId);
      expect(prismaMock.link.update).toHaveBeenCalledWith(expect.objectContaining({
        where: { id: linkId },
        data: expect.objectContaining({
          url: updateMockLinkInput.url,
          image: mockMetadata.image,
          tags: {
            createMany: {
              data: mockUpdatedTags.map(t => ({ tagId: t.id })),
              skipDuplicates: true,
            },
            deleteMany: {
              tagId: {
                notIn: mockUpdatedTags.map(t => t.id),
              },
            },
          },
        }),
        include: {
          tags: {
            select: {
              tag: true,
            },
          },
        },
      }));
      expect(result).toEqual(mappedLink);
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      const updateMockLinkInput = { url: faker.internet.url(), tags: [faker.word.sample()] };

      service.getIsUserOwner = jest.fn().mockResolvedValue(false);

      await expect(service.updateLink(updateMockLinkInput, linkId, userId)).rejects.toThrow('you_cannot_update_this_link');
    });
  });

  describe('deleteLink', () => {
    const userId = faker.string.uuid();
    const linkId = faker.string.uuid();

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should delete a link if user is owner', async () => {
      service.getIsUserOwner = jest.fn().mockResolvedValue(true);
      prismaMock.link.deleteMany.mockResolvedValue({ count: 1 });

      const result = await service.deleteLink(linkId, userId);

      expect(service.getIsUserOwner).toHaveBeenCalledWith(linkId, userId);
      expect(prismaMock.link.deleteMany).toHaveBeenCalledWith({
        where: {
          id: linkId,
          ownerId: userId,
        },
      });
      expect(result).toEqual({ count: 1 });
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      service.getIsUserOwner = jest.fn().mockResolvedValue(false);

      await expect(service.deleteLink(linkId, userId)).rejects.toThrow('you_cannot_delete_this_link');
    });
  });
});
