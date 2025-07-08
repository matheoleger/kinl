import { Injectable } from '@nestjs/common';
import { User } from 'prisma/generated/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserInput } from './contracts/users.contract';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async findOne(id: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        id,
      },
    });
  }

  async findOneByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email,
      },
    });
  }

  async create(user: CreateUserInput): Promise<User> {
    return this.prisma.user.create({
      data: user,
    });
  }
}
