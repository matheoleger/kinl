import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { LinksController } from '../links.controller';

describe('linksController', () => {
  let controller: LinksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LinksController],
    }).compile();

    controller = module.get<LinksController>(LinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
