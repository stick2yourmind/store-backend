import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from 'src/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const configService = app.get<ConfigService>(ConfigService);

  // Serve public folder
  app.useStaticAssets(join(__dirname, '..', 'public'));
  await app.listen(configService.getOrThrow('APP_PORT'));
}
bootstrap();
