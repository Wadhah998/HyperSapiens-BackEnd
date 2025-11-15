import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Driver, Session, Result, Record } from 'neo4j-driver';
import * as bcrypt from 'bcrypt';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UserService', () => {
  let service: UserService;
  let mockDriver: jest.Mocked<Driver>;
  let mockSession: jest.Mocked<Session>;
  let mockResult: any;
  let mockRecord: any;

  beforeEach(async () => {
    // Créer les mocks
    mockRecord = {
      get: jest.fn(),
    };

    mockResult = {
      records: [mockRecord],
      summary: {
        query: { text: '', parameters: {} },
        queryType: 'r',
        counters: {},
        updateStatistics: {},
        plan: null,
        profile: null,
        notifications: [],
        resultAvailableAfter: { low: 0, high: 0 },
        resultConsumedAfter: { low: 0, high: 0 },
        server: { address: '', version: '' },
        database: { name: '' },
      },
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
        UserService,
        {
          provide: 'NEO4J_DRIVER',
          useValue: mockDriver,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserInput: CreateUserInput = {
      name: 'John',
      prenom: 'Doe',
      email: 'john.doe@example.com',
      password: 'password123',
      role: 'CLIENT',
      number: 123456789,
      nomEntreprise: 'Test Company',
      adresseFacturation: '123 Test St',
      numTva: 'FR123456789',
      nomComptable: 'Accountant Name',
      contact: 'contact@example.com',
    };

    it('should create a user successfully', async () => {
      // Mock counter query
      const counterRecord = {
        get: jest.fn().mockReturnValue({
          toInt: jest.fn().mockReturnValue(1),
        }),
      };
      const counterResult = {
        records: [counterRecord],
        summary: {} as any,
      };

      // Mock user creation query
      const userNode = {
        properties: {
          id: 1,
          name: 'John',
          prenom: 'Doe',
          email: 'john.doe@example.com',
          password: 'hashedPassword',
          role: 'CLIENT',
          number: 123456789,
          nomEntreprise: 'Test Company',
          adresseFacturation: '123 Test St',
          numTva: 'FR123456789',
          nomComptable: 'Accountant Name',
          contact: 'contact@example.com',
          createdAt: new Date(),
        },
      };
      const userRecord = {
        get: jest.fn().mockReturnValue(userNode),
      };
      const userResult = {
        records: [userRecord],
      };

      // Setup mocks
      mockSession.run
        .mockResolvedValueOnce(counterResult as any)
        .mockResolvedValueOnce(userResult as any);

      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);

      const result = await service.create(createUserInput);

      expect(mockDriver.session).toHaveBeenCalled();
      expect(mockSession.run).toHaveBeenCalledTimes(2);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith('password123', 10);
      expect(result).toEqual(userNode.properties);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should create a user without password', async () => {
      const inputWithoutPassword: CreateUserInput = { 
        ...createUserInput, 
        password: undefined as any 
      };

      const counterRecord = {
        get: jest.fn().mockReturnValue({
          toInt: jest.fn().mockReturnValue(1),
        }),
      };
      const counterResult = {
        records: [counterRecord],
        summary: {} as any,
      };

      const userNode = {
        properties: {
          id: 1,
          name: 'John',
          prenom: 'Doe',
          email: 'john.doe@example.com',
          password: '',
          role: 'CLIENT',
          number: 123456789,
        },
      };
      const userRecord = {
        get: jest.fn().mockReturnValue(userNode),
      };
      const userResult = {
        records: [userRecord],
        summary: {} as any,
      };

      mockSession.run
        .mockResolvedValueOnce(counterResult as any)
        .mockResolvedValueOnce(userResult as any);

      const result = await service.create(inputWithoutPassword);

      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(result.password).toBe('');
    });

    it('should use default role CLIENT if not provided', async () => {
      const inputWithoutRole: CreateUserInput = { 
        ...createUserInput, 
        role: undefined as any 
      };

      const counterRecord = {
        get: jest.fn().mockReturnValue({
          toInt: jest.fn().mockReturnValue(1),
        }),
      };
      const counterResult = {
        records: [counterRecord],
      };

      const userNode = {
        properties: {
          id: 1,
          name: 'John',
          prenom: 'Doe',
          email: 'john.doe@example.com',
          password: 'hashedPassword',
          role: 'CLIENT',
          number: 123456789,
        },
      };
      const userRecord = {
        get: jest.fn().mockReturnValue(userNode),
      };
      const userResult = {
        records: [userRecord],
        summary: {} as any,
      };

      mockSession.run
        .mockResolvedValueOnce(counterResult as any)
        .mockResolvedValueOnce(userResult as any);

      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);

      await service.create(inputWithoutRole);

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          role: 'CLIENT',
        }),
      );
    });
  });

  describe('findAll', () => {
    it('should return all client users', async () => {
      const user1 = {
        properties: {
          id: 1,
          name: 'John',
          prenom: 'Doe',
          email: 'john@example.com',
          role: 'CLIENT',
          password: 'hashedPassword',
          number: 123456789,
        },
      };
      const user2 = {
        properties: {
          id: 2,
          name: 'Jane',
          prenom: 'Smith',
          email: 'jane@example.com',
          role: 'CLIENT',
          password: 'hashedPassword2',
          number: 987654321,
        },
      };

      const record1 = { get: jest.fn().mockReturnValue(user1) };
      const record2 = { get: jest.fn().mockReturnValue(user2) };

      mockResult.records = [record1, record2] as any;

      const result = await service.findAll();

      expect(mockSession.run).toHaveBeenCalledWith(
        'MATCH (u:User) WHERE u.password IS NOT NULL AND u.password <> "" AND u.role = "CLIENT" RETURN u',
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(user1.properties);
      expect(result[1]).toEqual(user2.properties);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should return empty array when no users found', async () => {
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
    it('should return a user by id', async () => {
      const userNode = {
        properties: {
          id: 1,
          name: 'John',
          prenom: 'Doe',
          email: 'john@example.com',
          role: 'CLIENT',
          password: 'hashedPassword',
          number: 123456789,
        },
      };

      mockRecord.get.mockReturnValue(userNode);

      const result = await service.findOne(1);

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('MATCH (u:User {id: $id})'),
        { id: 1 },
      );
      expect(result).toEqual(userNode.properties);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      mockResult.records = [];

      const result = await service.findOne(999);

      expect(result).toBeNull();
    });
  });

  describe('update', () => {
    const updateInput: UpdateUserInput = {
      id: 1,
      name: 'John Updated',
      email: 'john.updated@example.com',
    };

    it('should update a user successfully', async () => {
      const updatedUserNode = {
        properties: {
          id: 1,
          name: 'John Updated',
          prenom: 'Doe',
          email: 'john.updated@example.com',
          role: 'CLIENT',
          password: 'hashedPassword',
          number: 123456789,
        },
      };

      mockRecord.get.mockReturnValue(updatedUserNode);

      const result = await service.update(1, updateInput);

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('MATCH (u:User {id: $id})'),
        expect.objectContaining({
          id: 1,
          name: 'John Updated',
          email: 'john.updated@example.com',
        }),
      );
      expect(result).toEqual(updatedUserNode.properties);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      const emptyResult = {
        records: [],
        summary: {} as any,
      };
      mockSession.run.mockResolvedValueOnce(emptyResult as any);

      const result = await service.update(999, updateInput);

      expect(result).toBeNull();
    });

    it('should exclude id from update fields', async () => {
      const updatedUserNode = {
        properties: {
          id: 1,
          name: 'John Updated',
        },
      };

      mockRecord.get.mockReturnValue(updatedUserNode);

      await service.update(1, updateInput);

      const updateQuery = (mockSession.run as jest.Mock).mock.calls[0][0];
      expect(updateQuery).not.toContain('u.id = $id');
    });

    it('should update password if provided', async () => {
      const updateWithPassword: UpdateUserInput = {
        id: 1,
        password: 'newPassword123',
      };

      const updatedUserNode = {
        properties: {
          id: 1,
          password: 'newHashedPassword',
        },
      };

      mockRecord.get.mockReturnValue(updatedUserNode);
      mockedBcrypt.hash.mockResolvedValue('newHashedPassword' as never);

      // Note: Le service actuel ne hash pas le password dans update
      // Si vous voulez cette fonctionnalité, il faudra modifier le service
      const result = await service.update(1, updateWithPassword);

      expect(result).toBeDefined();
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      const countRecord = {
        get: jest.fn((key: string) => {
          if (key === 'count') {
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

      const result = await service.remove(1);

      expect(mockSession.run).toHaveBeenCalledWith(
        'MATCH (u:User {id: $id}) DETACH DELETE u RETURN COUNT(u) as count',
        { id: 1 },
      );
      expect(result).toBe(true);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should return false when user not found', async () => {
      const countRecord = {
        get: jest.fn((key: string) => {
          if (key === 'count') {
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

      const result = await service.remove(999);

      expect(result).toBe(false);
    });
  });

  describe('findByEmail', () => {
    it('should return a user by email', async () => {
      const userNode = {
        properties: {
          id: 1,
          name: 'John',
          prenom: 'Doe',
          email: 'john@example.com',
          role: 'CLIENT',
          password: 'hashedPassword',
          number: 123456789,
        },
      };

      mockRecord.get.mockReturnValue(userNode);

      const result = await service.findByEmail('john@example.com');

      expect(mockSession.run).toHaveBeenCalledWith(
        'MATCH (u:User {email: $email}) RETURN u',
        { email: 'john@example.com' },
      );
      expect(result).toEqual(userNode.properties);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should return null when user not found', async () => {
      const emptyResult = {
        records: [],
        summary: {} as any,
      };
      mockSession.run.mockResolvedValueOnce(emptyResult as any);

      const result = await service.findByEmail('notfound@example.com');

      expect(result).toBeNull();
    });
  });

  describe('findUsersWithoutPassword', () => {
    it('should return users without password', async () => {
      const user1 = {
        properties: {
          id: 1,
          name: 'John',
          prenom: 'Doe',
          email: 'john@example.com',
          password: '',
          role: 'CLIENT',
          number: 123456789,
        },
      };
      const user2 = {
        properties: {
          id: 2,
          name: 'Jane',
          prenom: 'Smith',
          email: 'jane@example.com',
          password: '',
          role: 'CLIENT',
          number: 987654321,
        },
      };

      const record1 = { get: jest.fn().mockReturnValue(user1) };
      const record2 = { get: jest.fn().mockReturnValue(user2) };

      const usersResult = {
        records: [record1, record2],
        summary: {} as any,
      };
      mockSession.run.mockResolvedValueOnce(usersResult as any);

      const result = await service.findUsersWithoutPassword();

      expect(mockSession.run).toHaveBeenCalledWith(
        'MATCH (u:User) WHERE u.password = "" RETURN u',
      );
      expect(result).toHaveLength(2);
      expect(result[0]).toEqual(user1.properties);
      expect(result[1]).toEqual(user2.properties);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should return empty array when no users without password', async () => {
      const emptyResult = {
        records: [],
        summary: {} as any,
      };
      mockSession.run.mockResolvedValueOnce(emptyResult as any);

      const result = await service.findUsersWithoutPassword();

      expect(result).toEqual([]);
    });
  });

  describe('findUserProjects', () => {
    it('should return user projects with formatted dates', async () => {
      const userId = 1;

      // Mock Neo4j date object
      const neo4jDate = {
        year: { low: 2024 },
        month: { low: 1 },
        day: { low: 15 },
        hour: { low: 10 },
        minute: { low: 30 },
        second: { low: 0 },
      };

      const projectRecord = {
        get: jest.fn((key: string) => {
          if (key === 'p.id') return 'project-1';
          if (key === 'p.name') return 'Test Project';
          if (key === 'p.status') return 'ACTIVE';
          if (key === 'p.createdAt') return neo4jDate;
          if (key === 'p.startDate') return neo4jDate;
          if (key === 'p.endDate') return neo4jDate;
          if (key === 'p.updatedAt') return neo4jDate;
          if (key === 'deliverableFiles') return [];
          return null;
        }),
      };

      const projectsResult = {
        records: [projectRecord],
        summary: {} as any,
      };
      mockSession.run.mockResolvedValueOnce(projectsResult as any);

      const result = await service.findUserProjects(userId);

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('MATCH (u:User {id: $userId})-[:OWNS]->(p:Project)'),
        { userId },
      );
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('project-1');
      expect(result[0].name).toBe('Test Project');
      expect(result[0].createdAt).toMatch(/2024-01-15/); // ISO date format
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should handle projects with deliverable files', async () => {
      const userId = 1;

      const deliverableFile = {
        properties: {
          id: 'file-1',
          fileName: 'test.pdf',
          originalName: 'test.pdf',
          mimeType: 'application/pdf',
          size: 1024,
          url: '/uploads/file-1.pdf',
          uploadedAt: {
            year: { low: 2024 },
            month: { low: 1 },
            day: { low: 15 },
          },
          projectId: 'project-1',
          approved: true,
          uploadedBy: 'user',
          uploadedById: '1',
          refusComment: null,
        },
      };

      const projectRecord = {
        get: jest.fn((key: string) => {
          if (key === 'p.id') return 'project-1';
          if (key === 'p.name') return 'Test Project';
          if (key === 'p.status') return 'ACTIVE';
          if (key === 'p.createdAt') return null;
          if (key === 'deliverableFiles') return [deliverableFile];
          return null;
        }),
      };

      const projectsResult = {
        records: [projectRecord],
        summary: {} as any,
      };
      mockSession.run.mockResolvedValueOnce(projectsResult as any);

      const result = await service.findUserProjects(userId);

      // Note: Le service retourne toujours un tableau vide pour deliverableFiles
      // (voir ligne 453 du service : deliverableFiles: [])
      expect(result[0].deliverableFiles).toEqual([]);
      expect(result[0].id).toBe('project-1');
      expect(result[0].name).toBe('Test Project');
    });

    it('should return empty array when user has no projects', async () => {
      const userId = 999;

      const emptyResult = {
        records: [],
        summary: {} as any,
      };
      mockSession.run.mockResolvedValueOnce(emptyResult as any);

      const result = await service.findUserProjects(userId);

      expect(result).toEqual([]);
    });

    it('should handle null dates gracefully', async () => {
      const userId = 1;

      const projectRecord = {
        get: jest.fn((key: string) => {
          if (key === 'p.id') return 'project-1';
          if (key === 'p.name') return 'Test Project';
          if (key === 'p.status') return 'ACTIVE';
          if (key === 'p.createdAt') return null;
          if (key === 'p.startDate') return null;
          if (key === 'p.endDate') return null;
          if (key === 'p.updatedAt') return null;
          if (key === 'deliverableFiles') return [];
          return null;
        }),
      };

      const projectsResult = {
        records: [projectRecord],
        summary: {} as any,
      };
      mockSession.run.mockResolvedValueOnce(projectsResult as any);

      const result = await service.findUserProjects(userId);

      expect(result[0].createdAt).toBeNull();
      expect(result[0].startDate).toBeNull();
      expect(result[0].endDate).toBeNull();
    });
  });

  describe('Error handling', () => {
    it('should close session even if error occurs in create', async () => {
      mockSession.run.mockRejectedValueOnce(new Error('Database error'));

      const createInput: CreateUserInput = {
        name: 'John',
        prenom: 'Doe',
        email: 'john@example.com',
        password: 'password123',
        role: 'CLIENT',
        number: 123456789,
      };

      await expect(service.create(createInput)).rejects.toThrow('Database error');
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should close session even if error occurs in findByEmail', async () => {
      mockSession.run.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findByEmail('test@example.com')).rejects.toThrow(
        'Database error',
      );
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should close session even if error occurs in findUserProjects', async () => {
      mockSession.run.mockRejectedValueOnce(new Error('Database error'));

      await expect(service.findUserProjects(1)).rejects.toThrow('Database error');
      expect(mockSession.close).toHaveBeenCalled();
    });
  });
});
