import { Injectable, Logger } from '@nestjs/common';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class GqlAuthGuard {
  private readonly logger = new Logger(GqlAuthGuard.name);

  constructor(private readonly jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const gqlContext = GqlExecutionContext.create(context).getContext();
    const authHeader = gqlContext.req.headers.authorization;

    if (!authHeader) {
      this.logger.error('Authorization header missing');
      throw new Error('Authorization header missing');
    }

    const token = authHeader.replace('Bearer ', '');

    try {
      const payload = await this.jwtService.verifyAsync(token);
      gqlContext.user = payload;
      return true;
    } catch (error) {
      this.logger.error('Invalid token', error.stack);
      throw new Error('Invalid token');
    }
  }
}
