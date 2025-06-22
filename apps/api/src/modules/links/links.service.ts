import type { PrismaService } from '../prisma/prisma.service';
import type { CreateLinkInput } from './contracts/links.contract';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getAllLinks() {
    return this.prisma.link.findMany();
  }

  async createLink(input: CreateLinkInput) {
    return this.prisma.link.create({
      data: input,
    });
  }
}
