import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.use(helmet());
  app.use(cookieParser());

  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3001';
  const vitrineUrl = process.env.VITRINE_URL || 'http://localhost:3000';
  const vercelUrl = process.env.VERCEL_URL || '';

  const allowedOrigins = [
    frontendUrl,
    vitrineUrl,
    vercelUrl,
    'https://guyafibre-frontend.vercel.app',
    'https://guyafibre.com',
    'https://www.guyafibre.com',
  ].filter(Boolean);

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const port = process.env.PORT || 4000;
  await app.listen(port);
  console.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();