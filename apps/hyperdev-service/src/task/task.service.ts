import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { Session, Driver } from 'neo4j-driver';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { Task } from './entities/task.entity';

@Injectable()
export class TaskService {
  constructor(@Inject('NEO4J_DRIVER') private readonly neo4jDriver: Driver) {}

  private getSession(): Session {
    return this.neo4jDriver.session();
  }

  async create(input: CreateTaskInput): Promise<Task> {
    const session = this.getSession();
    try {
      const now = new Date().toISOString();
      const result = await session.run(
        `
        CREATE (t:Task {
          id: randomUUID(),
          title: $title,
          description: $description,
          type: $type,
          priority: $priority,
          status: 'SUBMITTED',
          dueDate: $dueDate,
          clientId: $clientId,
          createdAt: datetime($createdAt),
          updatedAt: datetime($updatedAt)
        })
        RETURN t
        `,
        {
          ...input,
          createdAt: now,
          updatedAt: now,
        }
      );

      if (result.records.length === 0) {
        throw new Error('Failed to create task');
      }

      return result.records[0].get('t').properties as Task;
    } finally {
      await session.close();
    }
  }

  async findAll(): Promise<Task[]> {
    const session = this.getSession();
    try {
      const result = await session.run('MATCH (t:Task) RETURN t');
      return result.records.map((r) => r.get('t').properties as Task);
    } finally {
      await session.close();
    }
  }

  async findOne(id: string): Promise<Task> {
    const session = this.getSession();
    try {
      const result = await session.run('MATCH (t:Task {id: $id}) RETURN t', { id });
      if (result.records.length === 0) {
        throw new NotFoundException(`Task ${id} not found`);
      }
      return result.records[0].get('t').properties as Task;
    } finally {
      await session.close();
    }
  }

  async update(input: UpdateTaskInput): Promise<Task> {
    const session = this.getSession();
    try {
      const { id, ...fields } = input;
      const updatedAt = new Date().toISOString();

      const setClauses = Object.keys(fields)
        .filter((key) => fields[key] !== undefined)
        .map((key) => {
          if (['createdAt', 'updatedAt', 'dueDate'].includes(key)) {
            return `t.${key} = datetime($${key})`;
          }
          return `t.${key} = $${key}`;
        })
        .join(', ');

      const params = { id, ...fields, updatedAt };

      const result = await session.run(
        `
        MATCH (t:Task {id: $id})
        SET ${setClauses}, t.updatedAt = datetime($updatedAt)
        RETURN t
        `,
        params
      );

      if (result.records.length === 0) {
        throw new NotFoundException(`Task ${id} not found`);
      }

      return result.records[0].get('t').properties as Task;
    } finally {
      await session.close();
    }
  }

  async remove(id: string): Promise<boolean> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
        MATCH (t:Task {id: $id})
        DETACH DELETE t
        RETURN count(t) AS deleted
        `,
        { id }
      );

      return result.records[0].get('deleted').toInt() > 0;
    } finally {
      await session.close();
    }
  }
  async findByStatus(status: string): Promise<Task[]> {
    const session = this.getSession();
    try {
      const result = await session.run(
        `
      MATCH (t:Task {status: $status})
      RETURN t
      `,
        { status }
      );
      return result.records.map((r) => r.get('t').properties as Task);
    } finally {
      await session.close();
    }
  }
}
