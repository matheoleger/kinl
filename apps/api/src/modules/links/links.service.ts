import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLinkInput } from './contracts/links.contract';

@Injectable()
export class LinksService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async getAllLinks() {
    // return this.prisma.link.findMany();
    return [{ id: '1', url: 'https://github.com/lonestone/nzoth', createdAt: new Date(), updatedAt: new Date() }, { id: '2', url: 'https://github.com/matheoleger/kinl', createdAt: new Date(), updatedAt: new Date() }];
  }

  async createLink(input: CreateLinkInput) {
    return this.prisma.link.create({
      data: input,
    });
  }
}
