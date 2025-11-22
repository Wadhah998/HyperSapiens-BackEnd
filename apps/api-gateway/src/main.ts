import { NestFactory } from '@nestjs/core';
import { ApolloGateway, IntrospectAndCompose, RemoteGraphQLDataSource } from '@apollo/gateway';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import express from 'express';
import { ApiGatewayModule } from './api-gateway.module';
import cors from 'cors';
import { PrometheusService } from '../../../../Libs/shared/prometheus.service';

async function bootstrap() {
  const app = await NestFactory.create(ApiGatewayModule);

  const expressApp = express(); // Ensure express is callable
  expressApp.use(express.json({ limit: '10mb' }));
  expressApp.use(express.urlencoded({ extended: true, limit: '10mb' }));
  expressApp.use(cors());

  // Configuration des URLs des services via variables d'environnement
  // Par défaut, utilise localhost pour le développement local
  // Dans Docker, utilisez les noms de services Docker
  const userServiceUrl = process.env.USER_SERVICE_URL || 'http://localhost:3001/graphql';
  const authServiceUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:3002/graphql';
  const projectServiceUrl = process.env.PROJECT_SERVICE_URL || 'http://localhost:3003/graphql';
  const hyperdevServiceUrl = process.env.HYPERDEV_SERVICE_URL || 'http://localhost:3004/graphql';

  const gateway = new ApolloGateway({
    supergraphSdl: new IntrospectAndCompose({
      subgraphs: [
        { name: 'user-service', url: userServiceUrl },
        { name: 'auth-service', url: authServiceUrl },
        { name: 'project-service', url: projectServiceUrl },
        { name: 'hyperdev-service', url: hyperdevServiceUrl },
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

  // Route pour les métriques Prometheus
  expressApp.get('/metrics', async (req, res) => {
    try {
      const prometheusService = app.get(PrometheusService);
      const metrics = await prometheusService.getMetrics();
      res.set('Content-Type', 'text/plain');
      res.send(metrics);
    } catch (error) {
      // Si Prometheus n'est pas disponible, retourner des métriques vides
      res.set('Content-Type', 'text/plain');
      res.send('# Prometheus metrics not available\n');
    }
  });

  const gatewayPort = 3000;
  expressApp.listen(gatewayPort, () => {
    console.log(`🚀 Gateway ready at http://localhost:${gatewayPort}/graphql`);
    console.log(`📊 Metrics available at http://localhost:${gatewayPort}/metrics`);
  });
}

bootstrap();