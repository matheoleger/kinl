import { FilteringParams, TypedBody, TypedParam, TypedRoute } from '@lonestone/nzoth/server';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/contracts/users.contract';
import { CreateLinkInput, createLinkSchema, linkSchema, LinksFiltering, linksFilteringSchema, linksSchema, UpdateLinkInput, updateLinkSchema } from './contracts/links.contract';
import { LinksService } from './links.service';

@Controller('links')
@UseGuards(AuthGuard)
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
  ) {}

  @TypedRoute.Get('', linksSchema)
  getAllLinks(@CurrentUser() user: User, @FilteringParams(linksFilteringSchema) filter?: LinksFiltering) {
    return this.linksService.getAllLinksFromUser(user.id, filter);
  }

  @TypedRoute.Post('', linkSchema)
  createLink(
    @CurrentUser() user: User,
    @TypedBody(createLinkSchema) body: CreateLinkInput,
  ) {
    return this.linksService.createLink(body, user.id);
  }

  @TypedRoute.Patch(':id', linkSchema)
  updateLink(
    @CurrentUser() user: User,
    @TypedBody(updateLinkSchema) body: UpdateLinkInput,
    @TypedParam('id') linkId: string,
  ) {
    return this.linksService.updateLink(body, linkId, user.id);
  }

  @TypedRoute.Delete(':id')
  deleteLink(@CurrentUser() user: User, @TypedParam('id') linkId: string) {
    return this.linksService.deleteLink(linkId, user.id);
  }
}
