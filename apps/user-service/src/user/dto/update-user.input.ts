
import { InputType, Field, Int, PartialType } from '@nestjs/graphql';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput  {
  @Field(() => Int)
  id: number;
  @Field({ nullable: true })
  name?: string;

  @Field({ nullable: true })
  prenom?: string;

  @Field({ nullable: true })
  username?: string;

  @Field({ nullable: true })
  email?: string;

  @Field({ nullable: true })
  password?: string;

  @Field({ nullable: true, defaultValue: 'CLIENT' })
  role?: 'ADMIN' | 'CLIENT';

  @Field({ nullable: true })
  number?: number;

  // 👈 NOUVEAUX CHAMPS ENTREPRISE
  @Field({ nullable: true })
  nomEntreprise?: string;

  @Field({ nullable: true })
  adresseFacturation?: string;

  @Field({ nullable: true })
  numTva?: string;

  @Field({ nullable: true })
  nomComptable?: string;

  @Field({ nullable: true })
  contact?: string; // Peut être un numéro ou un email

}
