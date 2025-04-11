import { ObjectType, Field, ID } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';

@ObjectType()
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  prenom: string;

  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  role: 'ADMIN' | 'CLIENT';

  @Field()
  number: number;

  @Field()
  password: string;


  @Field({ nullable: true })
  createdAt?: Date = new Date();

  constructor(partial?: Partial<User>) {
    if (partial) {
      Object.assign(this as User, partial);
    }

    this.id = this.id ?? uuidv4();
    this.createdAt = this.createdAt ?? new Date();
  }
}
