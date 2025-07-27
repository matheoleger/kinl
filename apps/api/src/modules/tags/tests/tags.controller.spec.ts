import { ConfigModule } from '@nestjs/config';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { UsersService } from 'src/modules/users/users.service';
import { TagsController } from '../tags.controller';
import { TagsHelper } from '../tags.helper';
import { TagsService } from '../tags.service';

describe('tagsController', () => {
  let controller: TagsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env.test',
        }),
        JwtModule.register({
          secret: 'test-secret',
        }),
      ],
      controllers: [TagsController],
      providers: [
        TagsService,
        TagsHelper,
        UsersService,
        { provide: JwtService, useValue: {} },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<TagsController>(TagsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
