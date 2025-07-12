import { TypedBody, TypedRoute } from '@lonestone/nzoth/server';
import { Controller, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CreateLinkInput, createLinkSchema, linkSchema, linksSchema } from './contracts/links.contract';
import { LinksService } from './links.service';

@Controller('links')
@UseGuards(AuthGuard)
export class LinksController {
  constructor(
    private readonly linksService: LinksService,
  ) {}

  @TypedRoute.Get('', linksSchema)
  getAllLinks() {
    return this.linksService.getAllLinks();
  }

  @TypedRoute.Post('', linkSchema)
  createLink(@TypedBody(createLinkSchema) body: CreateLinkInput) {
    return this.linksService.createLink(body);
  }
}
