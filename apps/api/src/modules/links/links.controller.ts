import type { CreateLinkInput } from './contracts/links.contract';
import type { LinksService } from './links.service';
import { TypedBody, TypedRoute } from '@lonestone/nzoth/server';
import { Controller } from '@nestjs/common';
import { createLinkSchema, linkSchema, linksSchema } from './contracts/links.contract';

@Controller('links')
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
