import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectResolver } from './project.resolver';
import { Neo4jModule } from '../neo4j.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { SharedModule } from '../../../../Libs/shared/shared.module';

@Module({
  imports: [
    Neo4jModule,
    SharedModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver, // Utilisation du driver Apollo Federation
      autoSchemaFile: true,    // Génération automatique du schéma// Activer GraphQL Playground pour tester
      introspection: true,
      playground: true,                // Activer GraphQL Playground pour tester
      buildSchemaOptions: {
        orphanedTypes: [], // Ensure no orphaned types like `User` are included
      },// Activer l'introspection pour le débogage
    }),],
  providers: [ProjectResolver, ProjectService],
})
export class ProjectModule {}
