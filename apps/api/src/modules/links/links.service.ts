import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkInput } from './contracts/links.contract';

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
