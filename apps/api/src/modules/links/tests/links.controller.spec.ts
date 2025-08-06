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

describe('linksController', () => {
  let controller: LinksController;

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
        TagsModule,
      ],
      controllers: [LinksController],
      providers: [
        LinksService,
        LinksHelper,
        AuthService,
        UsersService,
        UrlValidationService,
        { provide: JwtService, useValue: {} },
        { provide: PrismaService, useValue: {} },
      ],
    }).compile();

    controller = module.get<LinksController>(LinksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
