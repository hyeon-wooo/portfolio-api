import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { readFileSync } from 'fs';
import { join } from 'path';
const pkg = JSON.parse(
  readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
);

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.use(cookieParser());
  // trust reverse proxy (for correct req.ip and X-Forwarded-For)
  const httpAdapter = app.getHttpAdapter();
  const expressApp = httpAdapter.getInstance();
  expressApp.set('trust proxy', 2);
  logger.log(`version: ${pkg.version}`);
  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production'
        ? [
            'https://adm-hi.hyeonwoo.com',
            'https://hi.hyeonwoo.com',
            'http://localhost:8081',
            'http://localhost:8082',
          ]
        : ['http://localhost:8081', 'http://localhost:8082'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: false,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
