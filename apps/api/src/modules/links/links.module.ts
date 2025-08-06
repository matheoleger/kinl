import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { LinksController } from './links.controller';
import { LinksHelper } from './links.helper';
import { UrlValidationMiddleware } from './middlewares/url-validation.middleware';
import { LinksService } from './services/links.service';
import { UrlValidationService } from './services/url-validation.service';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, TagsModule],
  controllers: [LinksController],
  providers: [LinksService, LinksHelper, UrlValidationService],
})
export class LinksModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UrlValidationMiddleware)
      .forRoutes({ path: 'links', method: RequestMethod.POST }, { path: 'links/:id', method: RequestMethod.PATCH });
  }
}
