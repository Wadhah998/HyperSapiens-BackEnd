import { InputType, Int, Field } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field()
  name: string;

  @Field()
  prenom: string;


  @Field()
  email: string;

  @Field({ nullable: true })
  password: string;

  @Field({ defaultValue: "CLIENT" })
  role: 'ADMIN' | 'CLIENT';

  @Field()
  number: number;
}
