// dto/create-project.input.ts
import { InputType, Field, ID, Float, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum, IsUUID, IsDateString, IsArray } from 'class-validator';
import { ProjectStatus } from '../entities/project.entity';


@InputType()
export class CreateProjectInput {
  @Field()
  @IsNotEmpty()
  name: string;

  @Field({ nullable: true })
  @IsOptional()
  description?: string;

  @Field(() => ID)
  @IsUUID()
  clientId: string;

  @Field(() => ProjectStatus)
  @IsEnum(ProjectStatus)
  status: ProjectStatus;

  @Field(() => Int, { defaultValue: 0 })
  @IsOptional()
  progress?: number;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  budgetEstime?: number;

  @Field({ nullable: true })
  @IsOptional()
  devise?: string;

  @Field(() => Float, { nullable: true })
  @IsOptional()
  budgetDepense?: number;

  @Field(() => [String], { nullable: 'itemsAndList' as const })
  @IsOptional()
  @IsArray()
  jalonsIds?: string[];

  @Field(() => [String], { nullable: 'itemsAndList' as const })
  @IsOptional()
  @IsArray()
  livrablesIds?: string[];

  @Field({ nullable: true })
  @IsOptional()
  cahierCharge?: string;

  @Field()
  @IsDateString()
  startDate: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  endDate?: string;

  @Field(() => ID, { nullable: true })
  @IsOptional()
  @IsUUID()
  lastUpdatedById?: string;

  @Field(() => [String], { nullable: 'itemsAndList' as const })
  @IsOptional()
  @IsArray()
  tags?: string[];

  @Field(() => [String], { nullable: 'itemsAndList' as const })
  @IsOptional()
  @IsArray()
  demandes?: string[];
}
