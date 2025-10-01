import { NestFactory } from '@nestjs/core';

import { GraphQLModule } from '@nestjs/graphql';
import { ProjectModule } from './project/project.module';



async function bootstrap() {
  const app = await NestFactory.create(ProjectModule);

  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:3002'],
    allowedHeaders: 'Content-Type,Authorization',
  });


  await app.listen(3003);  // L'API user-service écoute sur le port 3001
  console.log(`Project service is running on http://localhost:3003/graphql`);
}

bootstrap();
