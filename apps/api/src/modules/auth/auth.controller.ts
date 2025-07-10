import { TypedBody, TypedRoute } from '@lonestone/nzoth/server';
import { Controller, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from './auth.service';
import { RegisterInput, registerSchema, SignInInput, signInSchema } from './contracts/auth.contract';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @TypedRoute.Post('login')
  async signIn(@TypedBody(signInSchema) signInInput: SignInInput, @Res({ passthrough: true }) res: Response) {
    const { token } = await this.authService.signIn(signInInput);

    res.cookie('access_token', token, {
      httpOnly: true,
      secure: false, // TODO: handle this in the config?
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    return { message: 'Successfully signed in' };
  }

  @TypedRoute.Post('register')
  async register(@TypedBody(registerSchema) registerInput: RegisterInput) {
    return this.authService.register(registerInput);
  }

  @TypedRoute.Get('logout')
  async logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('access_token');

    return { message: 'Successfully logged out' };
  }
}
