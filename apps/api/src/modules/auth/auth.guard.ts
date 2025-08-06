import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request as ExpressRequest } from 'express';
import { User } from '../users/contracts/users.contract';
import { UsersService } from '../users/users.service';

type Request = ExpressRequest & { user?: User | null };

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const token: string | undefined = request?.cookies?.access_token;

    if (!token) {
      throw new UnauthorizedException('unauthorized');
    }

    try {
      const payload = await this.jwtService.verifyAsync<{ sub: string; email: string }>(
        token,
        {
          secret: this.configService.get<string>('JWT_SECRET'),
        },
      );

      const user = await this.usersService.findOne(payload.sub);

      request.user = user;
    }
    catch {
      throw new UnauthorizedException('unauthorized');
    }

    return true;
  }
}
