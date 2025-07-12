import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import configuration, { validateConfig } from './config/env.config';
import { AuthModule } from './modules/auth/auth.module';
import { LinksModule } from './modules/links/links.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
    load: [configuration],
    validate: validateConfig,
    envFilePath: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
  }), LinksModule, AuthModule, UsersModule],
})
export class AppModule {}
