import { ConsoleLogger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { existsSync, readFileSync } from 'fs';
import helmet from 'helmet';
import { join } from 'path';

import { AppModule } from './app.module';

async function bootstrap() {
  const keyPath = join(__dirname, '..', 'certs', 'server.key');
  const certPath = join(__dirname, '..', 'certs', 'server.crt');

  const useHttps = existsSync(keyPath) && existsSync(certPath);

  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    ...(useHttps && process.env?.NODE_ENV === 'production'
      ? {
          httpsOptions: {
            key: readFileSync(keyPath),
            cert: readFileSync(certPath)
          }
        }
      : {}),
    rawBody: true,
    bodyParser: false,
    logger: new ConsoleLogger({
      logLevels: ['log', 'fatal', 'error', 'warn', 'debug', 'verbose'],
      prefix: 'HELPDESK',
      timestamp: true,
      colors: true,
      json: false
    })
  });

  app.set('trust proxy', 1);

  const configService = app.get(ConfigService);

  app.use(compression());
  app.use(cookieParser());
  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ limit: '10mb', extended: false }));
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, 'data:', 'apollo-server-landing-page.cdn.apollographql.com'],
          scriptSrc: [`'self'`, `https:`, `'unsafe-inline'`],
          manifestSrc: [`'self'`, 'apollo-server-landing-page.cdn.apollographql.com'],
          frameSrc: [`'self'`, 'sandbox.embed.apollographql.com']
        }
      }
    })
  );

  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN'),
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true
      },
      stopAtFirstError: true
    })
  );

  const port = configService.getOrThrow<number>('PORT');
  const host = configService.getOrThrow<string>('HOST');

  await app.listen(port, host, async () => {
    console.info(`Application is running on: ${await app.getUrl()}/api`);
  });
}

bootstrap().catch(err => {
  console.error('Failed to application', err);
  process.exit(1);
});
