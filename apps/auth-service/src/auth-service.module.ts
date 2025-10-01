import { Module } from '@nestjs/common';
import { AuthServiceController } from './auth-service.controller';
import { AuthService } from './auth-service.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { ApolloDriver, ApolloDriverConfig, ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { AuthResolver } from './auth.resolver';
import { SharedModule } from '../../../Libs/shared/shared.module';

@Module({
  imports: [// Global configuration
    PassportModule,
    SharedModule,
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver, // Le driver Apollo est désormais requis
      autoSchemaFile: true, // Spécifie où le schéma GraphQL sera généré
      playground: true, // Active GraphQL Playground pour tester
      introspection: true, // Active l'introspection
    })
  ],
  controllers: [AuthServiceController],
  providers: [AuthService, JwtStrategy,AuthResolver],
  exports: [AuthService],
})
export class AuthServiceModule {}