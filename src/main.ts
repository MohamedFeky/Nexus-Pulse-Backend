import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: '*',
  });

  const validationPipe = new ValidationPipe({
    whitelist: true,
    transform: true,
  });

  app.useGlobalPipes(validationPipe);

  app.setGlobalPrefix('api');
  await app.listen(process.env.PORT || 3001);
  console.log('API running on http://localhost:3001/api');
}
bootstrap();
