import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { TagsHelper } from 'src/modules/tags/tags.helper';
import { TagsService } from 'src/modules/tags/tags.service';
import { LinksHelper } from '../links.helper';
import { LinksService } from '../services/links.service';

describe('linksService', () => {
  let service: LinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinksService, TagsService, TagsHelper, LinksHelper, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
