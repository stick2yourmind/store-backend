import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { LoggerInterceptor } from 'src/common/interceptor/logger.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  const configService = app.get<ConfigService>(ConfigService);

  app.useGlobalInterceptors(new LoggerInterceptor());

  // Add cookie middleware
  app.use(cookieParser());

  // Add validation middleware
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  // Serve public folder
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(configService.getOrThrow('APP_PORT'));
}
bootstrap();
