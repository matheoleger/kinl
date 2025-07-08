import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { config } from 'src/config/env.config';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [UsersModule, JwtModule.register({
    global: true,
    secret: config.JWT_SECRET,
    signOptions: { expiresIn: '1d' },
  })],
  providers: [AuthService],
  controllers: [AuthController],
})
export class AuthModule {}
