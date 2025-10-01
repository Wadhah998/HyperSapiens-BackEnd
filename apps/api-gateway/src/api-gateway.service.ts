import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiGatewayService {
  handleRequest(): string {
    return 'Request handled by API Gateway and forwarded to the appropriate microservice.';
  }
}