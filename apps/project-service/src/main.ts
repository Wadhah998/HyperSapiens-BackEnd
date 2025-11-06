import { NestFactory } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { GraphQLModule } from '@nestjs/graphql';
import { ProjectModule } from './project/project.module';
import express from 'express';

async function bootstrap() {
  // 👈 CONFIGURATION EXPRESS POUR L'UPLOAD DE FICHIERS
  const expressApp = express();
  const app = await NestFactory.create(ProjectModule, new ExpressAdapter(expressApp));

  // Configuration CORS pour l'upload de fichiers
  app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:3002', 'http://localhost:5173'],
    allowedHeaders: 'Content-Type,Authorization',
    credentials: true,
  });

  // Configuration pour l'upload de fichiers
  expressApp.use(express.json({ limit: '10mb' }));
  expressApp.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Servir les fichiers statiques uploadés
  expressApp.use('/uploads', express.static('uploads'));

  await app.listen(3003);
  console.log(`Project service is running on http://localhost:3003/graphql`);
}

bootstrap();
