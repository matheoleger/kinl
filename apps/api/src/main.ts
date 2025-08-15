import { addSchemasToSwagger, ZodSerializationExceptionFilter, ZodValidationExceptionFilter } from '@lonestone/nzoth/server';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { PrometheusInterceptor } from './modules/prometheus/prometheus.interceptor';
import { PrometheusService } from './modules/prometheus/prometheus.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: process.env.TRUSTED_ORIGINS?.split(','),
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setOpenAPIVersion('3.1.0')
    .setTitle('kinL API')
    .setDescription('The kinL API description')
    .setVersion('1.0')
    .addTag('@kinl')
    .build();

  // Registering custom exception filter for the Nzoth package
  app.useGlobalFilters(
    new ZodValidationExceptionFilter(),
    new ZodSerializationExceptionFilter(),
  );

  const document = SwaggerModule.createDocument(app, config);

  addSchemasToSwagger(document);

  if (process.env.NODE_ENV === 'development') {
    SwaggerModule.setup('docs', app, document, {
      jsonDocumentUrl: 'docs-json',
    });
  }

  app.useGlobalInterceptors(new PrometheusInterceptor(app.get(PrometheusService)));

  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
