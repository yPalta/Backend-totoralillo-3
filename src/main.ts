import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  //testeo de cors para frontend
  //app.enableCors(); 

  
  app.useGlobalPipes(new ValidationPipe({ //validador global
    whitelist: true,
    forbidNonWhitelisted: true, 
    transform: true, 
  }));

  await app.listen(3000);
}
bootstrap();