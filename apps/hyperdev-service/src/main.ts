import { NestFactory } from '@nestjs/core';
import { TaskModule } from './task/task.module';


async function bootstrap() {
  const app = await NestFactory.create(TaskModule);

  app.enableCors({
    origin: ['http://localhost:3000','http://localhost:3002'],
    allowedHeaders: 'Content-Type,Authorization',
  });


  await app.listen(3004);  // L'API user-service écoute sur le port 3001
  console.log(`Task service is running on http://localhost:3004/graphql`);
}
bootstrap();
