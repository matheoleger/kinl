import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { LinksModule } from './modules/links/links.module';

@Module({
  imports: [ConfigModule.forRoot(), LinksModule],
})
export class AppModule {}
