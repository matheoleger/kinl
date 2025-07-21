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

  @TypedRoute.Post('', tagsSchema)
  createMultipleTags(@CurrentUser() user: User, @TypedBody(createTagsSchema) body: CreateTagsInput) {
    return this.tagsService.createMultipleTags(body, user.id);
  }

  @TypedRoute.Delete(':id')
  deleteTag(@CurrentUser() user: User, @TypedParam('id') tagId: string) {
    const isUserOwner = this.tagsService.getIsUserOwner(tagId, user.id);

    if (!isUserOwner) {
      throw new Error('You are not the owner of this tag');
    }

    return this.tagsService.deleteTag(tagId);
  }

  @TypedRoute.Patch(':id', tagSchema)
  updateTag(@CurrentUser() user: User, @TypedBody(updateTagSchema) body: UpdateTagInput, @TypedParam('id') tagId: string) {
    const isUserOwner = this.tagsService.getIsUserOwner(tagId, user.id);

    if (!isUserOwner) {
      throw new Error('You are not the owner of this tag');
    }

    return this.tagsService.updateTag(tagId, body);
  }
}
