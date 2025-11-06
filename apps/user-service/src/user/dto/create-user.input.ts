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
