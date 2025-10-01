// src/auth/dto/auth.dto.ts
import { InputType, Field } from '@nestjs/graphql';

@InputType('LoginInput')
export class LoginInput {
  @Field()
  email: string;

  @Field()
  password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
