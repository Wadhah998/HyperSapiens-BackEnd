import { Injectable } from '@nestjs/common';
import { Registry, Counter, Histogram, Gauge } from 'prom-client';

@Injectable()
export class PrometheusService {
  private readonly register: Registry;
  public readonly httpRequestDuration: Histogram<string>;
  public readonly httpRequestTotal: Counter<string>;
  public readonly httpRequestErrors: Counter<string>;
  public readonly activeConnections: Gauge<string>;
  public readonly graphqlRequests: Counter<string>;
  public readonly graphqlErrors: Counter<string>;
  public readonly graphqlDuration: Histogram<string>;

  constructor() {
    this.register = new Registry();
    
    // Ajouter les métriques par défaut de Node.js
    this.register.setDefaultLabels({
      app: 'hyper-sapiens',
    });

    // Compteur de requêtes HTTP totales
    this.httpRequestTotal = new Counter({
      name: 'http_requests_total',
      help: 'Total number of HTTP requests',
      labelNames: ['method', 'route', 'status_code', 'service'],
      registers: [this.register],
    });

    // Histogramme de durée des requêtes HTTP
    this.httpRequestDuration = new Histogram({
      name: 'http_request_duration_seconds',
      help: 'Duration of HTTP requests in seconds',
      labelNames: ['method', 'route', 'status_code', 'service'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
      registers: [this.register],
    });

    // Compteur d'erreurs HTTP
    this.httpRequestErrors = new Counter({
      name: 'http_request_errors_total',
      help: 'Total number of HTTP request errors',
      labelNames: ['method', 'route', 'error_type', 'service'],
      registers: [this.register],
    });

    // Gauge de connexions actives
    this.activeConnections = new Gauge({
      name: 'http_active_connections',
      help: 'Number of active HTTP connections',
      labelNames: ['service'],
      registers: [this.register],
    });

    // Compteur de requêtes GraphQL
    this.graphqlRequests = new Counter({
      name: 'graphql_requests_total',
      help: 'Total number of GraphQL requests',
      labelNames: ['operation', 'operation_name', 'service'],
      registers: [this.register],
    });

    // Compteur d'erreurs GraphQL
    this.graphqlErrors = new Counter({
      name: 'graphql_errors_total',
      help: 'Total number of GraphQL errors',
      labelNames: ['operation', 'operation_name', 'error_type', 'service'],
      registers: [this.register],
    });

    // Histogramme de durée des requêtes GraphQL
    this.graphqlDuration = new Histogram({
      name: 'graphql_request_duration_seconds',
      help: 'Duration of GraphQL requests in seconds',
      labelNames: ['operation', 'operation_name', 'service'],
      buckets: [0.1, 0.5, 1, 2, 5, 10],
      registers: [this.register],
    });
  }

  initializeMetrics() {
    // Cette méthode peut être utilisée pour initialiser des métriques supplémentaires
    try {
      console.log('✅ Prometheus metrics initialized');
    } catch (error) {
      // Ne pas casser l'application si Prometheus échoue
      console.warn('⚠️ Prometheus initialization warning (non-blocking):', error);
    }
  }

  getMetrics(): Promise<string> {
    try {
      return this.register.metrics();
    } catch (error) {
      // Retourner des métriques vides en cas d'erreur
      console.warn('Prometheus getMetrics error (non-blocking):', error);
      return Promise.resolve('# Prometheus metrics temporarily unavailable\n');
    }
  }

  getRegister(): Registry {
    return this.register;
  }
}

