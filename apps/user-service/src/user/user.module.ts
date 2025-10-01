import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserResolver } from './user.resolver';
import { Neo4jModule } from '../neo4j.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { SharedModule } from '../../../../Libs/shared/shared.module';


@Module({
  imports: [
    SharedModule,
    Neo4jModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver, // Utilisation du driver Apollo Federation
      autoSchemaFile: true,    // Génération automatique du schéma// Activer GraphQL Playground pour tester
      introspection: true,
      playground: true,                // Activer GraphQL Playground pour tester
      buildSchemaOptions: {
        orphanedTypes: [], // Ensure no orphaned types like `User` are included
      },// Activer l'introspection pour le débogage
    }),
  ],
  providers: [UserService, UserResolver],
  exports: [UserService],
})
export class UserModule {}
