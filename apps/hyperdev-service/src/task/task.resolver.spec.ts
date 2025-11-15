import { Test, TestingModule } from '@nestjs/testing';
import { TaskResolver } from './task.resolver';
import { TaskService } from './task.service';
import { Driver } from 'neo4j-driver';

describe('TaskResolver', () => {
  let resolver: TaskResolver;
  let mockDriver: jest.Mocked<Driver>;

  beforeEach(async () => {
    mockDriver = {
      session: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskResolver,
        TaskService,
        {
          provide: 'NEO4J_DRIVER',
          useValue: mockDriver,
        },
      ],
    }).compile();

    resolver = module.get<TaskResolver>(TaskResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
