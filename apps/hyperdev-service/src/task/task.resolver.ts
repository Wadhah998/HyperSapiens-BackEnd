import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { TaskService } from './task.service';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task, TaskStatus } from './entities/task.entity';

@Resolver(() => Task)
export class TaskResolver {
  constructor(private readonly taskService: TaskService) {}

  @Mutation(() => Task)
  async createTask(@Args('input') input: CreateTaskInput): Promise<Task> {
    return this.taskService.create(input);
  }

  @Query(() => [Task])
  async getTasks(): Promise<Task[]> {
    return this.taskService.findAll();
  }

  @Query(() => Task)
  async getTaskById(@Args('id', { type: () => ID }) id: string): Promise<Task> {
    return this.taskService.findOne(id);
  }

  @Mutation(() => Task)
  async updateTask(@Args('input') input: UpdateTaskInput): Promise<Task> {
    return this.taskService.update(input);
  }

  @Mutation(() => Boolean)
  async removeTask(@Args('id', { type: () => ID }) id: string): Promise<boolean> {
    return this.taskService.remove(id);
  }

  @Query(() => [Task])
  async getTasksByStatus(@Args('status', { type: () => TaskStatus }) status: TaskStatus): Promise<Task[]> {
    return this.taskService.findByStatus(status);
  }

}
