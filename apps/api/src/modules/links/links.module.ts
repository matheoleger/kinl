import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TagsModule } from '../tags/tags.module';
import { UsersModule } from '../users/users.module';
import { LinksController } from './links.controller';
import { LinksHelper } from './links.helper';
import { LinksService } from './links.service';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule, TagsModule],
  controllers: [LinksController],
  providers: [LinksService, LinksHelper],
})
export class LinksModule {}
