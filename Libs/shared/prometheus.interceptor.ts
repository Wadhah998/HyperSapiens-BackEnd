import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { PrometheusService } from './prometheus.service';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class PrometheusInterceptor implements NestInterceptor {
  constructor(private readonly prometheusService: PrometheusService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Si Prometheus n'est pas disponible, passer la requête sans métriques
    if (!this.prometheusService) {
      return next.handle();
    }

    try {
      const request = context.switchToHttp().getRequest();
      const serviceName = process.env.SERVICE_NAME || 'unknown-service';
      
      // Détecter si c'est une requête GraphQL
      // On essaie de créer un GqlExecutionContext, si ça fonctionne c'est GraphQL
      let isGraphQL = false;
      try {
        const gqlContext = GqlExecutionContext.create(context);
        isGraphQL = !!gqlContext.getInfo();
      } catch {
        // Si on ne peut pas créer GqlExecutionContext, ce n'est pas GraphQL
        isGraphQL = request.url?.includes('/graphql') || false;
      }
      
      if (isGraphQL) {
        return this.interceptGraphQL(context, next, serviceName);
      } else {
        return this.interceptHTTP(context, next, serviceName);
      }
    } catch (error) {
      // En cas d'erreur, continuer sans métriques pour ne pas casser la requête
      console.warn('Prometheus interceptor error (non-blocking):', error);
      return next.handle();
    }
  }

  private interceptGraphQL(
    context: ExecutionContext,
    next: CallHandler,
    serviceName: string,
  ): Observable<any> {
    try {
      const gqlContext = GqlExecutionContext.create(context);
      const info = gqlContext.getInfo();
      const operation = info?.operation?.operation || 'unknown';
      const operationName = info?.fieldName || 'unknown';
      
      const startTime = Date.now();

      return next.handle().pipe(
        tap(() => {
          try {
            const duration = (Date.now() - startTime) / 1000;
            
            // Enregistrer la requête GraphQL
            this.prometheusService?.graphqlRequests?.inc({
              operation,
              operation_name: operationName,
              service: serviceName,
            });

            // Enregistrer la durée
            this.prometheusService?.graphqlDuration?.observe(
              {
                operation,
                operation_name: operationName,
                service: serviceName,
              },
              duration,
            );
          } catch (error) {
            // Ignorer les erreurs de métriques
            console.warn('Prometheus metrics error (non-blocking):', error);
          }
        }),
      catchError((error) => {
        try {
          const duration = (Date.now() - startTime) / 1000;
          
          // Enregistrer l'erreur GraphQL
          this.prometheusService?.graphqlErrors?.inc({
            operation,
            operation_name: operationName,
            error_type: error.constructor?.name || 'UnknownError',
            service: serviceName,
          });

          // Enregistrer la durée même en cas d'erreur
          this.prometheusService?.graphqlDuration?.observe(
            {
              operation,
              operation_name: operationName,
              service: serviceName,
            },
            duration,
          );
        } catch (metricsError) {
          // Ignorer les erreurs de métriques
          console.warn('Prometheus metrics error (non-blocking):', metricsError);
        }

        return throwError(() => error);
      }),
    );
    } catch (error) {
      // En cas d'erreur d'interception, continuer sans métriques
      console.warn('Prometheus interceptor error (non-blocking):', error);
      return next.handle();
    }
  }

  private interceptHTTP(
    context: ExecutionContext,
    next: CallHandler,
    serviceName: string,
  ): Observable<any> {
    try {
      const request = context.switchToHttp().getRequest();
      const response = context.switchToHttp().getResponse();
      
      const method = request.method || 'GET';
      const route = request.route?.path || request.url || 'unknown';
      const startTime = Date.now();

      // Incrémenter les connexions actives
      try {
        this.prometheusService?.activeConnections?.inc({ service: serviceName });
      } catch (error) {
        // Ignorer les erreurs de métriques
      }

    return next.handle().pipe(
      tap(() => {
        try {
          const duration = (Date.now() - startTime) / 1000;
          const statusCode = response.statusCode || 200;

          // Enregistrer la requête HTTP
          this.prometheusService?.httpRequestTotal?.inc({
            method,
            route,
            status_code: statusCode.toString(),
            service: serviceName,
          });

          // Enregistrer la durée
          this.prometheusService?.httpRequestDuration?.observe(
            {
              method,
              route,
              status_code: statusCode.toString(),
              service: serviceName,
            },
            duration,
          );

          // Décrémenter les connexions actives
          this.prometheusService?.activeConnections?.dec({ service: serviceName });
        } catch (error) {
          // Ignorer les erreurs de métriques
          console.warn('Prometheus metrics error (non-blocking):', error);
        }
      }),
      catchError((error) => {
        try {
          const duration = (Date.now() - startTime) / 1000;
          const statusCode = error.status || 500;
          const errorType = error.constructor?.name || 'UnknownError';

          // Enregistrer l'erreur HTTP
          this.prometheusService?.httpRequestErrors?.inc({
            method,
            route,
            error_type: errorType,
            service: serviceName,
          });

          // Enregistrer la requête avec le code d'erreur
          this.prometheusService?.httpRequestTotal?.inc({
            method,
            route,
            status_code: statusCode.toString(),
            service: serviceName,
          });

          // Enregistrer la durée même en cas d'erreur
          this.prometheusService?.httpRequestDuration?.observe(
            {
              method,
              route,
              status_code: statusCode.toString(),
              service: serviceName,
            },
            duration,
          );

          // Décrémenter les connexions actives
          this.prometheusService?.activeConnections?.dec({ service: serviceName });
        } catch (metricsError) {
          // Ignorer les erreurs de métriques
          console.warn('Prometheus metrics error (non-blocking):', metricsError);
        }

        return throwError(() => error);
      }),
    );
    } catch (error) {
      // En cas d'erreur d'interception, continuer sans métriques
      console.warn('Prometheus interceptor error (non-blocking):', error);
      return next.handle();
    }
  }
}

