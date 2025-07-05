import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { LinksService } from '../links.service';

describe('linksService', () => {
  let service: LinksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LinksService, { provide: PrismaService, useValue: {} }],
    }).compile();

    service = module.get<LinksService>(LinksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
