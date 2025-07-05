import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { LinksController } from '../links.controller';
import { LinksService } from '../links.service';

describe('linksController', () => {
  let controller: LinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinksController],
      providers: [LinksService, { provide: PrismaService, useValue: {} }],
    }).compile();

    controller = module.get<LinksController>(LinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
