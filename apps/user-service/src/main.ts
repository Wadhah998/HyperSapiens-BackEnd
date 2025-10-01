import { NestFactory } from '@nestjs/core';

import { GraphQLModule } from '@nestjs/graphql';
import { UserModule } from './user/user.module';


async function bootstrap() {
  const app = await NestFactory.create(UserModule);

  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:3002'],
    allowedHeaders: 'Content-Type,Authorization',
  });


  await app.listen(3001);  // L'API user-service écoute sur le port 3001
  console.log(`User service is running on http://localhost:3001/graphql`);
}

bootstrap();
