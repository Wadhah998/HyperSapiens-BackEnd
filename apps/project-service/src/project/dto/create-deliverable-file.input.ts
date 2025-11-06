import { InputType, Field, ID, Int } from '@nestjs/graphql';
import { IsString, IsNotEmpty, IsOptional, IsNumber, IsMimeType, IsUrl, IsUUID, IsBoolean } from 'class-validator';

@InputType()
export class CreateDeliverableFileInput {
  @Field()
  @IsString()
  @IsNotEmpty()
  fileName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  originalName: string;

  @Field()
  @IsMimeType()
  @IsNotEmpty()
  mimeType: string;

  @Field(() => Int)
  @IsNumber()
  @IsNotEmpty()
  size: number;

  @Field()
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  projectId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean()
  approved?: boolean; // null = en attente, true = approuvé, false = rejeté

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  uploadedBy?: string; // 'user' ou 'admin'

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  uploadedById?: string; // ID de l'utilisateur ou admin qui a uploadé

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  refusComment?: string; // Commentaire de refus ajouté par l'utilisateur
}
