import { ObjectType, Field, ID, Float, Int, Directive , registerEnumType } from '@nestjs/graphql';


// Note: On ne doit pas importer User, Milestone, Deliverable directement en microservice isolé,
// ici on suppose qu'ils sont exposés par d'autres microservices via API Gateway.

export enum ProjectStatus {
  PENDING = 'PENDING',
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  ON_HOLD = 'ON_HOLD',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}
registerEnumType(ProjectStatus, {
  name: 'ProjectStatus',
  description: 'Status du projet',
});

@ObjectType('Project')
@Directive('@key(fields: "id")')
export class Project {
  @Field(() => ID)
  id: string;

  @Field()
  name: string;

  @Field({ nullable: true })
  description?: string;

  // Id du client (User)
  @Field(() => ID)
  clientId: string;

  @Field(() => ProjectStatus)
  status: ProjectStatus;

  @Field(() => Int, { defaultValue: 0 })
  progress: number; // 0–100

  @Field(() => Float, { nullable: true })
  budgetEstime?: number;

  @Field({ nullable: true })
  devise?: string;

  @Field(() => Float, { nullable: true })
  budgetDepense?: number;

  // Ids ou objets jalons à synchroniser via API ou events
  @Field(() => [String], { nullable: 'itemsAndList' })
  jalonsIds?: string[];
  // Ids ou objets livrables à synchroniser via API ou events
  @Field(() => [String], { nullable: 'itemsAndList' })
  livrablesIds?: string[];

  @Field({ nullable: true })
  cahierCharge?: string;

  @Field()
  startDate: Date;

  @Field({ nullable: true })
  endDate?: Date;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  // Id du dernier utilisateur qui a modifié le projet
  @Field(() => ID, { nullable: true })
  lastUpdatedById?: string;

  @Field(() => [String], { nullable: 'itemsAndList' })
  tags?: string[];

  @Field(() => [String], { nullable: 'itemsAndList' })
  demandes?: string[];
}
