import { generateTestUser } from 'test/test.utils';
import { faker } from '@faker-js/faker';
import { FilterRule } from '@lonestone/nzoth/server';
import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from 'src/modules/auth/auth.service';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { TagsModule } from 'src/modules/tags/tags.module';
import { UsersService } from 'src/modules/users/users.service';
import { LinksController } from '../links.controller';
import { LinksHelper } from '../links.helper';
import { LinksService } from '../services/links.service';
import { UrlValidationService } from '../services/url-validation.service';
import { generateTestLink, generateTestLinkInput, generateTestLinks } from './links-test.utils';

describe('linksController', () => {
  let controller: LinksController;
  let linksService: jest.Mocked<LinksService>;

  const mockPrismaService = {
    user: {
      findMany: jest.fn().mockResolvedValue([{ id: '1', username: 'John' }]),
      findUnique: jest.fn().mockImplementation(({ where: { id } }) => {
        return Promise.resolve({ id, username: 'John' });
      }),
    },
  };

  beforeEach(async () => {
    const mockLinksService = {
      getAllLinksFromUser: jest.fn().mockResolvedValue([]),
      createLink: jest.fn().mockResolvedValue({}),
      deleteLink: jest.fn().mockResolvedValue({}),
      updateLink: jest.fn().mockResolvedValue({}),
    };

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        JwtModule.register({
          secret: 'test-secret',
        }),
        TagsModule,
      ],
      controllers: [LinksController],
      providers: [
        { provide: LinksService, useValue: mockLinksService },
        LinksHelper,
        AuthService,
        UsersService,
        UrlValidationService,
        { provide: JwtService, useValue: {} },
        { provide: PrismaService, useValue: mockPrismaService },
      ],
    }).compile();

    controller = module.get<LinksController>(LinksController);
    linksService = module.get(LinksService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getAllLinks', () => {
    it('should return all links for user without filters', async () => {
      const mockLinks = generateTestLinks(10);
      linksService.getAllLinksFromUser.mockResolvedValue(mockLinks);
      const user = generateTestUser();

      const links = await controller.getAllLinks(user);

      expect(links).toBeDefined();
      expect(links).toEqual(mockLinks);
      expect(linksService.getAllLinksFromUser).toHaveBeenCalledWith(user.id, undefined);
    });

    it('should return all links for user with filters', async () => {
      const mockLinks = generateTestLinks(10);

      linksService.getAllLinksFromUser.mockResolvedValue(mockLinks);
      const user = generateTestUser();
      const filter = [{ property: 'tags' as const, rule: FilterRule.EQUALS, value: 'test' }];

      const links = await controller.getAllLinks(user, filter);

      expect(linksService.getAllLinksFromUser).toHaveBeenCalledWith(user.id, filter);
      expect(links).toBeDefined();
      expect(links).toEqual(mockLinks);
    });
  });

  describe('createLink', () => {
    it('should create a link', async () => {
      const mockLinkInput = generateTestLinkInput();
      const mockLink = {
        ...generateTestLink(),
        ...mockLinkInput,
        tags: mockLinkInput.tags.map(t => ({ id: faker.string.uuid(), name: t })),
      };
      const user = generateTestUser();

      linksService.createLink.mockResolvedValue(mockLink);

      const link = await controller.createLink(user, mockLinkInput);

      expect(linksService.createLink).toHaveBeenCalledWith(mockLinkInput, user.id);
      expect(link).toBeDefined();
      expect(link).toEqual(mockLink);
    });

    it('should create a link without optional fields', async () => {
      const minimalLinkInput = { url: faker.internet.url() };
      const createdLink = {
        ...generateTestLink(),
        ...minimalLinkInput,
        tags: [],
      };
      const user = generateTestUser();

      linksService.createLink.mockResolvedValue(createdLink);

      const link = await controller.createLink(user, minimalLinkInput);

      expect(linksService.createLink).toHaveBeenCalledWith(minimalLinkInput, user.id);
      expect(link).toBeDefined();
      expect(link).toEqual(createdLink);
    });

    it('should handle errors', async () => {
      const mockLinkInput = generateTestLinkInput();
      const user = generateTestUser();

      linksService.createLink.mockRejectedValue(new Error('test_error'));

      await expect(controller.createLink(user, mockLinkInput)).rejects.toThrow('test_error');
      expect(linksService.createLink).toHaveBeenCalledWith(mockLinkInput, user.id);
    });
  });

  describe('updateLink', () => {
    const mockLinkInput = generateTestLinkInput();
    const mockLink = {
      ...generateTestLink(),
      ...mockLinkInput,
      tags: mockLinkInput.tags.map(t => ({ id: faker.string.uuid(), name: t })),
    };
    const user = generateTestUser();

    it('should update a link', async () => {
      linksService.updateLink.mockResolvedValue(mockLink);

      const link = await controller.updateLink(user, mockLinkInput, mockLink.id);

      expect(linksService.updateLink).toHaveBeenCalledWith(mockLinkInput, mockLink.id, user.id);
      expect(link).toBeDefined();
      expect(link).toEqual(mockLink);
    });

    it('should update a link with partial data', async () => {
      const partialLinkInput = { title: faker.lorem.sentence() };
      const mockLink = {
        ...generateTestLink(),
        ...partialLinkInput,
      };

      linksService.updateLink.mockResolvedValue(mockLink);

      const link = await controller.updateLink(user, partialLinkInput, mockLink.id);

      expect(linksService.updateLink).toHaveBeenCalledWith(partialLinkInput, mockLink.id, user.id);
      expect(link).toBeDefined();
      expect(link).toEqual(mockLink);
    });

    it('should handle errors', async () => {
      linksService.updateLink.mockRejectedValue(new Error('test_error'));

      await expect(controller.updateLink(user, mockLinkInput, mockLink.id)).rejects.toThrow('test_error');
      expect(linksService.updateLink).toHaveBeenCalledWith(mockLinkInput, mockLink.id, user.id);
    });
  });

  describe('deleteLink', () => {
    const mockLink = generateTestLink();
    const user = generateTestUser();

    it('should delete a link', async () => {
      const expectedResult = { count: 1 };

      linksService.deleteLink.mockResolvedValue(expectedResult);

      const result = await controller.deleteLink(user, mockLink.id);

      expect(linksService.deleteLink).toHaveBeenCalledWith(mockLink.id, user.id);
      expect(result).toEqual(expectedResult);
    });

    it('should handle non existing link', async () => {
      const expectedResult = { count: 0 };

      linksService.deleteLink.mockResolvedValue(expectedResult);

      const result = await controller.deleteLink(user, faker.string.uuid());

      expect(linksService.deleteLink).toHaveBeenCalledWith(expect.any(String), user.id);
      expect(result).toEqual(expectedResult);
    });

    it('should handle errors', async () => {
      const user = generateTestUser();

      linksService.deleteLink.mockRejectedValue(new Error('test_error'));

      await expect(controller.deleteLink(user, mockLink.id)).rejects.toThrow('test_error');
      expect(linksService.deleteLink).toHaveBeenCalledWith(mockLink.id, user.id);
    });
  });
});
