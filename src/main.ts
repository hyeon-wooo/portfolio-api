import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import pkg from '../package.json';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.use(cookieParser());
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
