import { ObjectType, Field, ID, Directive } from '@nestjs/graphql';
import { v4 as uuidv4 } from 'uuid';
import { Project } from '../../../../project-service/src/project/entities/project.entity';

@ObjectType('User')
@Directive('@key(fields: "id")')
export class User {
  @Field(() => ID)
  id: number;

  @Field()
  name: string;

  @Field()
  prenom: string;




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
