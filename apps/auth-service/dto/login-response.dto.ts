// src/auth/dto/login-response.dto.ts
import { ObjectType, Field } from '@nestjs/graphql';

@ObjectType()
export class LoginResponseDto {
  @Field()
  access_token: string;
  constructor(access_token: string) {
    this.access_token = access_token;
  }
}
