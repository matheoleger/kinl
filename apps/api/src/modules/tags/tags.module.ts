import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { PrismaModule } from '../prisma/prisma.module';
import { UsersModule } from '../users/users.module';
import { TagsController } from './tags.controller';
import { TagsHelper } from './tags.helper';
import { TagsService } from './tags.service';

@Module({
  imports: [PrismaModule, AuthModule, UsersModule],
  controllers: [TagsController],
  providers: [TagsService, TagsHelper],
  exports: [TagsService],
})
export class TagsModule {}
