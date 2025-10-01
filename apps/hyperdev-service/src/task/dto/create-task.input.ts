// dto/create-task.input.ts

import { InputType, Field, ID } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { TaskType, TaskPriority } from '../entities/task.entity';

@InputType()
export class CreateTaskInput {
  @Field()
  @IsNotEmpty()
  title: string;

  @Field()
  @IsNotEmpty()
  description: string;

  @Field(() => TaskType)
  @IsEnum(TaskType)
  type: TaskType;

  @Field(() => TaskPriority)
  @IsEnum(TaskPriority)
  priority: TaskPriority;

  @Field({ nullable: true })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @Field(() => ID)
  @IsUUID()
  clientId: string;
}
