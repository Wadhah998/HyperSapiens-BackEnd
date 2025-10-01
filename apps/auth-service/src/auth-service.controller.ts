import { Controller, Get } from '@nestjs/common';
import { AuthService } from './auth-service.service';


@Controller()
export class AuthServiceController {
  constructor(private readonly authServiceService: AuthService) {}

  @Get()
  getHello(): string {
    return this.authServiceService.getHello();
  }
}
