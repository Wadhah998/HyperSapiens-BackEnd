import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { Neo4jModule } from '../neo4j.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { SharedModule } from '../../../../Libs/shared/shared.module';
import { FileUploadService } from './file-upload.service';
import { UploadController } from './upload.controller';
import { DeliverableFileService } from './deliverable-file.service';

@Module({
  imports: [
    Neo4jModule,
    SharedModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver, // Utilisation du driver Apollo Federation
      autoSchemaFile: true,    // Génération automatique du schéma
      introspection: true,
      playground: true,                // Activer GraphQL Playground pour tester
      buildSchemaOptions: {
        orphanedTypes: [], // Ensure no orphaned types like `User` are included
      },
      // 👈 INTÉGRATION EXPRESS POUR L'UPLOAD DE FICHIERS
      context: ({ req }) => ({ req }),
      plugins: [],
    }),],
  providers: [ProjectResolver, ProjectService, FileUploadService, DeliverableFileService],
  controllers: [UploadController],
})
export class ProjectModule {}
