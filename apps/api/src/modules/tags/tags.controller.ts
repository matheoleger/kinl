import { TypedBody, TypedParam, TypedRoute } from '@lonestone/nzoth/server';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/contracts/users.contract';
import { CreateTagsInput, createTagsSchema, tagSchema, tagsSchema, UpdateTagInput, updateTagSchema } from './contracts/tags.contract';
import { TagsService } from './tags.service';

@Controller('tags')
@UseGuards(AuthGuard)
export class TagsController {
  constructor(
    private readonly tagsService: TagsService,
  ) {}

  @TypedRoute.Get('', tagsSchema)
  getAllTags(@CurrentUser() user: User) {
    return this.tagsService.getAllTags(user.id);
  }

  @TypedRoute.Get('pinned', tagsSchema)
  getAllPinnedTags(@CurrentUser() user: User) {
    return this.tagsService.getAllPinnedTags(user.id);
  }

  @TypedRoute.Post('', tagsSchema)
  createMultipleTags(@CurrentUser() user: User, @TypedBody(createTagsSchema) body: CreateTagsInput) {
    return this.tagsService.createMultipleTags(body, user.id);
  }

  @TypedRoute.Post(':tagId/pin', tagSchema)
  createPinnedTag(@CurrentUser() user: User, @TypedParam('tagId') tagId: string) {
    return this.tagsService.createPinnedTag(tagId, user.id);
  }

  @TypedRoute.Delete(':id')
  deleteTag(@CurrentUser() user: User, @TypedParam('id') tagId: string) {
    return this.tagsService.deleteTag(tagId, user.id);
  }

  @TypedRoute.Delete(':tagId/pin')
  deletePinnedTag(@CurrentUser() user: User, @TypedParam('tagId') tagId: string) {
    return this.tagsService.deletePinnedTag(tagId, user.id);
  }

  @TypedRoute.Patch(':id', tagSchema)
  updateTag(@CurrentUser() user: User, @TypedBody(updateTagSchema) body: UpdateTagInput, @TypedParam('id') tagId: string) {
    return this.tagsService.updateTag(tagId, body, user.id);
  }
}
