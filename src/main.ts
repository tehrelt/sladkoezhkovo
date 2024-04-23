import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { mkdirSync, writeFileSync } from 'fs';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.use(cookieParser());
  app.enableCors({
    origin: '*',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('SLADKOEZHKOVO API')
    .setDescription(
      'API к курсовому проекту по ПСБД <br/> &copy; Evteev Dmitry 2024',
    )
    .setVersion('0.1.0')
    .addBearerAuth({
      type: 'http',
      in: 'Header',
      scheme: 'Bearer',
    })
    .addCookieAuth('refreshToken', {
      type: 'http',
      in: 'Cookie',
      scheme: 'Bearer',
    })
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/api/docs', app, document, {
    swaggerOptions: {
      requestInterceptor: (req) => {
        req.credentials = 'include';
        return req;
      },
    },
  });

  try {
    mkdirSync('./docs');
  } catch (e) {}
  writeFileSync('./docs/swagger-spec.json', JSON.stringify(document));

  await app.listen(process.env.APP_PORT);
}
bootstrap();
