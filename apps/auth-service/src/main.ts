import { NestFactory } from '@nestjs/core';
import { AuthServiceModule } from './auth-service.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthServiceModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    allowedHeaders: 'Content-Type,Authorization',
  });
  await app.listen(3002);  // L'API user-service écoute sur le port 3001
  console.log(`auth service is running on http://localhost:3002/graphql`);
}
bootstrap();
