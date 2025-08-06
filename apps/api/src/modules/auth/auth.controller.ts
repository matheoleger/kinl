import { TypedBody, TypedRoute } from '@lonestone/nzoth/server';
import { Controller, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { safeUserSchema, User } from '../users/contracts/users.contract';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { RegisterInput, registerSchema, SignInInput, signInSchema } from './contracts/auth.contract';
import { CurrentUser } from './decorators/current-user.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @TypedRoute.Post('login')
  async signIn(@TypedBody(signInSchema) signInInput: SignInInput, @Res({ passthrough: true }) res: Response) {
    const { accessToken, refreshToken } = await this.authService.signIn(signInInput);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // TODO: handle for production
      maxAge: 1000 * 60 * 15, // 15 min
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // TODO: handle for production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return { message: 'Successfully signed in' };
  }

  @TypedRoute.Post('refresh')
  async refreshToken(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies.refresh_token;

    if (!refreshToken) {
      throw new UnauthorizedException('unauthorized');
    }

    const { accessToken, refreshToken: newRefreshToken } = await this.authService.refreshToken(refreshToken);

    res.cookie('access_token', accessToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // TODO: handle for production
      maxAge: 1000 * 60 * 15, // 15 min
    });

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      sameSite: 'lax',
      secure: false, // TODO: handle for production
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    return { message: 'Successfully refreshed token' };
  }

  @TypedRoute.Post('register')
  async register(@TypedBody(registerSchema) registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @TypedRoute.Get('logout')
  @UseGuards(AuthGuard)
  async logout(@CurrentUser() user: User, @Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');

    // TODO: invalidate the token
    await this.authService.logout(user.id);

    return { message: 'Successfully logged out' };
  }

  @TypedRoute.Get('me', safeUserSchema)
  @UseGuards(AuthGuard)
  async me(@CurrentUser() user: User) {
    return user;
  }
}
