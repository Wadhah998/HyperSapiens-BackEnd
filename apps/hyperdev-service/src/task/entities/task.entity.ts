import { ObjectType, Field, ID, registerEnumType, Directive } from '@nestjs/graphql';



export enum TaskType {
  FRONTEND = 'FRONTEND',
  BACKEND = 'BACKEND',
  CLOUD = 'CLOUD',
  SECURITY = 'SECURITY',
  DEVOPS = 'DEVOPS',
  QA = 'QA',
  DESIGN = 'DESIGN',
  DOCS = 'DOCS',
  DATA = 'DATA',
}

export enum TaskPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum TaskStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  TRIAGED = 'TRIAGED',
  ASSIGNED = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  IN_REVIEW = 'IN_REVIEW',
  DONE = 'DONE',
}

registerEnumType(TaskType, { name: 'TaskType' });
registerEnumType(TaskPriority, { name: 'TaskPriority' });
registerEnumType(TaskStatus, { name: 'TaskStatus' });

@ObjectType('task')
@Directive('@key(fields: "id")')
export class Task {
  @Field(() => ID) id: string;

  @Field() title: string;

  @Field() description: string;

  @Field(() => TaskType) type: TaskType;

  @Field(() => TaskPriority) priority: TaskPriority;

  @Field(() => TaskStatus) status: TaskStatus;

  @Field({ nullable: true }) dueDate?: string;

  @Field() createdAt: string;

  @Field() updatedAt: string;

  @Field(() => ID)
  clientId: string;



}
