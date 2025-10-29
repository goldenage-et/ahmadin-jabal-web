import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './filters/http.filter';

async function bootstrap() {
  const logger = new Logger('Main::App');

  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const allowedOrigins = [
    configService.get('CLIENT_HOST'),
    configService.get('SERVER_HOST'),
    'http://localhost:3000',
    'http://localhost:3001',
    'http://127.0.0.1:3000',
    'http://127.0.0.1:3001',
  ];

  logger.debug({ allowedOrigins });

  app.enableCors({
    credentials: true,
    origin: allowedOrigins,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'Range',
      'Accept',
      'Cookie',
    ],
    exposedHeaders: [
      'Content-Range',
      'Content-Length',
      'Content-Type',
      'Set-Cookie',
    ],
  });

  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.useGlobalFilters(new HttpExceptionFilter());

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('ahmadin API')
    .setDescription('The ahmadin API documentation')
    .setVersion('1.0')
    .addCookieAuth('sessionId')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  const port = configService.get('SERVER_PORT');
  await app.listen(port);
  logger.debug(`App is listening at ${configService.get('SERVER_HOST')}`);
  logger.debug(
    `Swagger documentation available at ${configService.get('SERVER_HOST')}/api-docs`,
  );
}
bootstrap();
