import { ObjectType, Field, ID } from '@nestjs/graphql';

@ObjectType('DeliverableFile')
export class DeliverableFile {
  @Field(() => ID)
  id: string;

  @Field()
  fileName: string;

  @Field()
  originalName: string;

  @Field()
  mimeType: string;

  @Field()
  size: number;

  @Field()
  url: string;

  @Field()
  uploadedAt: Date;

  @Field(() => ID)
  projectId: string;

  @Field({ nullable: true })
  approved?: boolean; // null = en attente, true = approuvé, false = rejeté

  @Field({ nullable: true })
  uploadedBy?: string; // 'user' ou 'admin'

  @Field({ nullable: true })
  uploadedById?: string; // ID de l'utilisateur ou admin qui a uploadé

  @Field({ nullable: true })
  refusComment?: string; // Commentaire de refus ajouté par l'utilisateur

  constructor(partial: Partial<DeliverableFile>) {
    Object.assign(this, partial);
  }
}
