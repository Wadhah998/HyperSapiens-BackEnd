import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { TaskResolver } from './task.resolver';
import { Neo4jModule } from '../neo4j.config';
import { SharedModule } from '../../../../Libs/shared/shared.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';

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
  providers: [TaskResolver, TaskService],
})
export class TaskModule {}
