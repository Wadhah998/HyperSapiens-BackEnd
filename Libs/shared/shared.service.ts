import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SharedService {
  constructor(private readonly configService: ConfigService) {}

  onModuleInit() {
  }
}
