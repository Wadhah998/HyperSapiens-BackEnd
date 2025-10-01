import { NestFactory } from '@nestjs/core';
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { ApiGatewayModule } from './api-gateway.module';
import cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const expressApp = express(); // Ensure express is callable
  expressApp.use(express.json());
  expressApp.use(cors());

  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: 'user-service', url: 'http://localhost:3001/graphql' },
        { name: 'auth-service', url: 'http://localhost:3002/graphql' },
        { name: 'project-service', url: 'http://localhost:3003/graphql' },
        { name: 'hyperdev-service', url: 'http://localhost:3004/graphql' },
      ],
    }),
    buildService({ url }) {
      return new RemoteGraphQLDataSource({
        url,
        willSendRequest({ request, context }: { request: any; context: Record<string, any> }) {
          const headers = context?.headers || {};
          const authorization = headers.authorization;
          if (authorization) {
            request.http.headers.set('Authorization', authorization);
          }
        },
      });
    },
  });

  const server = new ApolloServer({
    gateway,
  });

  await server.start();

  expressApp.use(
    '/graphql',
    expressMiddleware(server, {
      context: async ({ req }) => ({ headers: req.headers }),
    })
  );

  const gatewayPort = 3000;
  expressApp.listen(gatewayPort, () => {
    console.log(`🚀 Gateway ready at http://localhost:${gatewayPort}/graphql`);
  });
}

bootstrap();