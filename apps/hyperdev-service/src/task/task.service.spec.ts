import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { TaskService } from './task.service';
import { Driver, Session, Result, Record } from 'neo4j-driver';
import { CreateTaskInput } from './dto/create-task.input';
import { UpdateTaskInput } from './dto/update-task.input';
import { TaskType, TaskPriority } from './entities/task.entity';

describe('TaskService', () => {
  let service: TaskService;
  let mockDriver: jest.Mocked<Driver>;
  let mockSession: jest.Mocked<Session>;
  let mockResult: any;
  let mockRecord: any;

  beforeEach(async () => {
    // Create mocks
    mockRecord = {
      get: jest.fn(),
    };

    mockResult = {
      records: [mockRecord],
      summary: {} as any,
    };

    mockSession = {
      run: jest.fn().mockResolvedValue(mockResult),
      close: jest.fn().mockResolvedValue(undefined),
    } as any;

    mockDriver = {
      session: jest.fn().mockReturnValue(mockSession),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TaskService,
        {
          provide: 'NEO4J_DRIVER',
          useValue: mockDriver,
        },
      ],
    }).compile();

    service = module.get<TaskService>(TaskService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createInput: CreateTaskInput = {
      title: 'Test Task',
      description: 'Test Description',
      type: TaskType.FRONTEND,
      priority: TaskPriority.HIGH,
      dueDate: new Date().toISOString(),
      clientId: '1',
    };

    it('should create a task successfully', async () => {
      const taskNode = {
        properties: {
          id: 'task-1',
          title: 'Test Task',
          description: 'Test Description',
          type: 'FEATURE',
          priority: 'HIGH',
          status: 'SUBMITTED',
          dueDate: new Date().toISOString(),
          clientId: 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      mockRecord.get.mockReturnValue(taskNode);

      const result = await service.create(createInput);

      expect(mockDriver.session).toHaveBeenCalled();
      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('CREATE (t:Task'),
        expect.objectContaining({
          title: 'Test Task',
          description: 'Test Description',
          type: TaskType.FRONTEND,
          priority: TaskPriority.HIGH,
        }),
      );
      expect(result).toEqual(taskNode.properties);
      expect(result.status).toBe('SUBMITTED');
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should throw error when task creation fails', async () => {
      const emptyResult = {
        records: [],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(emptyResult as any);

      await expect(service.create(createInput)).rejects.toThrow('Failed to create task');
    });
  });

  describe('findAll', () => {
    it('should return all tasks', async () => {
      const task1 = {
        properties: {
          id: 'task-1',
          title: 'Task 1',
          status: 'SUBMITTED',
        },
      };
      const task2 = {
        properties: {
          id: 'task-2',
          title: 'Task 2',
          status: 'IN_PROGRESS',
        },
      };

      const record1 = { get: jest.fn().mockReturnValue(task1) };
      const record2 = { get: jest.fn().mockReturnValue(task2) };

      const tasksResult = {
        records: [record1, record2],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(tasksResult as any);

      const result = await service.findAll();

      expect(mockSession.run).toHaveBeenCalledWith('MATCH (t:Task) RETURN t');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('task-1');
      expect(result[1].id).toBe('task-2');
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should return empty array when no tasks', async () => {
      const emptyResult = {
        records: [],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(emptyResult as any);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a task by id', async () => {
      const taskNode = {
        properties: {
          id: 'task-1',
          title: 'Test Task',
          status: 'SUBMITTED',
        },
      };

      mockRecord.get.mockReturnValue(taskNode);

      const result = await service.findOne('task-1');

      expect(mockSession.run).toHaveBeenCalledWith(
        'MATCH (t:Task {id: $id}) RETURN t',
        { id: 'task-1' },
      );
      expect(result).toEqual(taskNode.properties);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should throw NotFoundException when task not found', async () => {
      const emptyResult = {
        records: [],
        summary: {} as any,
      };

      // Override the default mock for this specific test
      const originalRun = mockSession.run;
      mockSession.run = jest.fn().mockResolvedValue(emptyResult as any);

      try {
        await expect(service.findOne('non-existent')).rejects.toThrow(NotFoundException);
        await expect(service.findOne('non-existent')).rejects.toThrow(
          'Task non-existent not found',
        );
      } finally {
        // Restore original mock
        mockSession.run = originalRun;
      }
    });
  });

  describe('update', () => {
    const updateInput: UpdateTaskInput = {
      id: 'task-1',
      title: 'Updated Task',
    };

    it('should update a task successfully', async () => {
      const updatedTaskNode = {
        properties: {
          id: 'task-1',
          title: 'Updated Task',
        },
      };

      mockRecord.get.mockReturnValue(updatedTaskNode);

      const result = await service.update(updateInput);

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('MATCH (t:Task {id: $id})'),
        expect.objectContaining({
          id: 'task-1',
          title: 'Updated Task',
        }),
      );
      expect(result).toEqual(updatedTaskNode.properties);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should throw NotFoundException when task not found', async () => {
      const emptyResult = {
        records: [],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(emptyResult as any);

      await expect(service.update(updateInput)).rejects.toThrow(NotFoundException);
    });

    it('should handle date fields correctly', async () => {
      const updateWithDate: UpdateTaskInput = {
        id: 'task-1',
        dueDate: new Date().toISOString(),
      };

      const updatedTaskNode = {
        properties: {
          id: 'task-1',
          dueDate: new Date().toISOString(),
        },
      };

      mockRecord.get.mockReturnValue(updatedTaskNode);

      await service.update(updateWithDate);

      const updateQuery = (mockSession.run as jest.Mock).mock.calls[0][0];
      expect(updateQuery).toContain('t.dueDate = datetime($dueDate)');
    });
  });

  describe('remove', () => {
    it('should delete a task successfully', async () => {
      const countRecord = {
        get: jest.fn((key: string) => {
          if (key === 'deleted') {
            return {
              toInt: jest.fn().mockReturnValue(1),
            };
          }
          return null;
        }),
      };

      const deleteResult = {
        records: [countRecord],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(deleteResult as any);

      const result = await service.remove('task-1');

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('MATCH (t:Task {id: $id})'),
        { id: 'task-1' },
      );
      expect(result).toBe(true);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should return false when task not found', async () => {
      const countRecord = {
        get: jest.fn((key: string) => {
          if (key === 'deleted') {
            return {
              toInt: jest.fn().mockReturnValue(0),
            };
          }
          return null;
        }),
      };

      const deleteResult = {
        records: [countRecord],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(deleteResult as any);

      const result = await service.remove('non-existent');

      expect(result).toBe(false);
    });
  });

  describe('findByStatus', () => {
    it('should return tasks by status', async () => {
      const task1 = {
        properties: {
          id: 'task-1',
          title: 'Task 1',
          status: 'SUBMITTED',
        },
      };
      const task2 = {
        properties: {
          id: 'task-2',
          title: 'Task 2',
          status: 'SUBMITTED',
        },
      };

      const record1 = { get: jest.fn().mockReturnValue(task1) };
      const record2 = { get: jest.fn().mockReturnValue(task2) };

      const tasksResult = {
        records: [record1, record2],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(tasksResult as any);

      const result = await service.findByStatus('SUBMITTED');

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('MATCH (t:Task {status: $status})'),
        { status: 'SUBMITTED' },
      );
      expect(result).toHaveLength(2);
      expect(result[0].status).toBe('SUBMITTED');
      expect(result[1].status).toBe('SUBMITTED');
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should return empty array when no tasks with status', async () => {
      const emptyResult = {
        records: [],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(emptyResult as any);

      const result = await service.findByStatus('COMPLETED');

      expect(result).toEqual([]);
    });
  });

  describe('Error handling', () => {
    it('should close session even if error occurs in create', async () => {
      mockSession.run.mockRejectedValueOnce(new Error('Database error'));

      const createInput: CreateTaskInput = {
        title: 'Test',
        description: 'Test',
        type: TaskType.FRONTEND,
        priority: TaskPriority.HIGH,
        dueDate: new Date().toISOString(),
        clientId: '1',
      };

      await expect(service.create(createInput)).rejects.toThrow('Database error');
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should close session even if error occurs in findAll', async () => {
      mockSession.run.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findAll()).rejects.toThrow('Database error');
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should close session even if error occurs in findOne', async () => {
      mockSession.run.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findOne('task-1')).rejects.toThrow('Database error');
      expect(mockSession.close).toHaveBeenCalled();
    });
  });
});
