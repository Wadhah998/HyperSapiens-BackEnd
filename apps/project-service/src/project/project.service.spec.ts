import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { ProjectService } from './project.service';
import { FileUploadService } from './file-upload.service';
import { DeliverableFileService } from './deliverable-file.service';
import { Driver, Session, Result, Record } from 'neo4j-driver';
import { CreateProjectInput } from './dto/create-project.input';
import { UpdateProjectInput } from './dto/update-project.input';
import { ProjectStatus } from './entities/project.entity';

describe('ProjectService', () => {
  let service: ProjectService;
  let mockDriver: jest.Mocked<Driver>;
  let mockSession: jest.Mocked<Session>;
  let mockFileUploadService: jest.Mocked<FileUploadService>;
  let mockDeliverableFileService: jest.Mocked<DeliverableFileService>;
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

    mockFileUploadService = {
      isAllowedFileType: jest.fn().mockReturnValue(true),
      isAllowedFileSize: jest.fn().mockReturnValue(true),
      saveProjectFile: jest.fn(),
      deleteProjectFile: jest.fn(),
      saveOffreProjectFile: jest.fn(),
      deleteOffreProjectFile: jest.fn(),
      saveContratFile: jest.fn(),
      deleteContratFile: jest.fn(),
      saveContratSigneFile: jest.fn(),
      deleteContratSigneFile: jest.fn(),
      savePurchaseFile: jest.fn(),
      deletePurchaseFile: jest.fn(),
      saveMeetingReportFile: jest.fn(),
      deleteMeetingReportFile: jest.fn(),
      saveRapportTestFile: jest.fn(),
      deleteRapportTestFile: jest.fn(),
      saveGuideUtilisateurFile: jest.fn(),
      deleteGuideUtilisateurFile: jest.fn(),
      saveDocTechniqueFile: jest.fn(),
      deleteDocTechniqueFile: jest.fn(),
      saveFormationClientFile: jest.fn(),
      deleteFormationClientFile: jest.fn(),
      saveDemoFileFile: jest.fn(),
      deleteDemoFileFile: jest.fn(),
      saveDocRecetteFile: jest.fn(),
      deleteDocRecetteFile: jest.fn(),
      saveDocExploitationFile: jest.fn(),
      deleteDocExploitationFile: jest.fn(),
    } as any;

    mockDeliverableFileService = {
      findByProjectId: jest.fn(),
      create: jest.fn(),
      remove: jest.fn(),
      removeByProjectId: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectService,
        {
          provide: 'NEO4J_DRIVER',
          useValue: mockDriver,
        },
        {
          provide: FileUploadService,
          useValue: mockFileUploadService,
        },
        {
          provide: DeliverableFileService,
          useValue: mockDeliverableFileService,
        },
      ],
    }).compile();

    service = module.get<ProjectService>(ProjectService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createInput: CreateProjectInput = {
      name: 'Test Project',
      description: 'Test Description',
      clientId: '1',
      status: ProjectStatus.DRAFT,
      progress: 0,
      budgetEstime: 10000,
      devise: 'EUR',
      budgetDepense: 0,
      jalonsIds: [],
      livrablesIds: [],
      cahierCharge: undefined,
      startDate: new Date().toISOString(),
      endDate: undefined,
      lastUpdatedById: '1',
      tags: [],
      demandes: [],
    };

    it('should create a project successfully', async () => {
      const projectNode = {
        properties: {
          id: 'project-1',
          name: 'Test Project',
          description: 'Test Description',
          clientId: 1,
          status: 'DRAFT',
          progress: 0,
          budgetEstime: 10000,
          devise: 'EUR',
          budgetDepense: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      };

      const projectRecord = {
        get: jest.fn().mockReturnValue(projectNode),
      };

      const relationRecord = {
        get: jest.fn().mockReturnValue({
          toInt: jest.fn().mockReturnValue(1),
        }),
      };

      const createResult = {
        records: [projectRecord],
        summary: {} as any,
      };

      const relationResult = {
        records: [relationRecord],
        summary: {} as any,
      };

      mockSession.run
        .mockResolvedValueOnce(createResult as any)
        .mockResolvedValueOnce(relationResult as any);

      const result = await service.create(createInput);

      expect(mockDriver.session).toHaveBeenCalled();
      expect(mockSession.run).toHaveBeenCalledTimes(2);
      expect(result).toEqual(projectNode.properties);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should throw error when project creation fails', async () => {
      const emptyResult = {
        records: [],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(emptyResult as any);

      await expect(service.create(createInput)).rejects.toThrow('Failed to create project');
    });
  });

  describe('findAll', () => {
    it('should return all projects', async () => {
      const project1 = {
        properties: {
          id: 'project-1',
          name: 'Project 1',
          status: 'DRAFT',
        },
      };
      const project2 = {
        properties: {
          id: 'project-2',
          name: 'Project 2',
          status: 'ACTIVE',
        },
      };

      const record1 = { get: jest.fn().mockReturnValue(project1) };
      const record2 = { get: jest.fn().mockReturnValue(project2) };

      const projectsResult = {
        records: [record1, record2],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(projectsResult as any);

      const result = await service.findAll();

      expect(mockSession.run).toHaveBeenCalledWith('MATCH (p:Project) RETURN p');
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('project-1');
      expect(result[1].id).toBe('project-2');
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should return empty array when no projects', async () => {
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
    it('should return a project by id', async () => {
      const projectNode = {
        properties: {
          id: 'project-1',
          name: 'Test Project',
          status: 'DRAFT',
        },
      };

      mockRecord.get.mockReturnValue(projectNode);

      const result = await service.findOne('project-1');

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('MATCH (p:Project {id: $id})'),
        { id: 'project-1' },
      );
      expect(result).toEqual(projectNode.properties);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should throw NotFoundException when project not found', async () => {
      const emptyResult = {
        records: [],
        summary: {} as any,
      };

      // Override the default mock for this specific test
      const originalRun = mockSession.run;
      mockSession.run = jest.fn().mockResolvedValue(emptyResult as any);

      try {
        await expect(service.findOne('non-existent')).rejects.toThrow(
          NotFoundException,
        );
        await expect(service.findOne('non-existent')).rejects.toThrow(
          'Project non-existent not found',
        );
      } finally {
        // Restore original mock
        mockSession.run = originalRun;
      }
    });
  });

  describe('update', () => {
    const updateInput: UpdateProjectInput = {
      id: 'project-1',
      name: 'Updated Project',
      status: ProjectStatus.IN_PROGRESS,
    };

    it('should update a project successfully', async () => {
      const updatedProjectNode = {
        properties: {
          id: 'project-1',
          name: 'Updated Project',
          status: ProjectStatus.IN_PROGRESS,
        },
      };

      mockRecord.get.mockReturnValue(updatedProjectNode);

      const result = await service.update(updateInput);

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('MATCH (p:Project {id: $id})'),
        expect.objectContaining({
          id: 'project-1',
          name: 'Updated Project',
          status: ProjectStatus.IN_PROGRESS,
        }),
      );
      expect(result).toEqual(updatedProjectNode.properties);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should throw NotFoundException when project not found', async () => {
      const emptyResult = {
        records: [],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(emptyResult as any);

      await expect(service.update(updateInput)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should delete a project successfully', async () => {
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

      const result = await service.remove('project-1');

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('MATCH (p:Project {id: $id})'),
        { id: 'project-1' },
      );
      expect(result).toBe(true);
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should return false when project not found', async () => {
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

  describe('createProjectRequest', () => {
    const createInput: CreateProjectInput = {
      name: 'Test Request',
      description: 'Test Description',
      clientId: '1',
      status: ProjectStatus.PENDING,
      progress: 0,
      budgetEstime: 0,
      devise: 'EUR',
      budgetDepense: 0,
      jalonsIds: [],
      livrablesIds: [],
      cahierCharge: undefined,
      startDate: new Date().toISOString(),
      endDate: undefined,
      lastUpdatedById: '1',
      tags: [],
      demandes: [],
    };

    it('should create a project request with PENDING status', async () => {
      const projectNode = {
        properties: {
          id: 'request-1',
          name: 'Test Request',
          status: 'PENDING',
        },
      };

      mockRecord.get.mockReturnValue(projectNode);

      const result = await service.createProjectRequest(createInput);

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('status: "PENDING"'),
        expect.any(Object),
      );
      expect(result).toEqual(projectNode.properties);
      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe('findPendingRequests', () => {
    it('should return all pending project requests', async () => {
      const project1 = {
        properties: {
          id: 'request-1',
          name: 'Request 1',
          status: 'PENDING',
        },
      };
      const project2 = {
        properties: {
          id: 'request-2',
          name: 'Request 2',
          status: 'PENDING',
        },
      };

      const record1 = { get: jest.fn().mockReturnValue(project1) };
      const record2 = { get: jest.fn().mockReturnValue(project2) };

      const pendingResult = {
        records: [record1, record2],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(pendingResult as any);

      const result = await service.findPendingRequests();

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining("status: 'PENDING'"),
      );
      expect(result).toHaveLength(2);
      expect(result[0].status).toBe('PENDING');
      expect(mockSession.close).toHaveBeenCalled();
    });
  });

  describe('acceptOrRejectRequest', () => {
    it('should accept a request and set status to DRAFT', async () => {
      const acceptedProject = {
        properties: {
          id: 'request-1',
          status: 'DRAFT',
        },
      };

      mockRecord.get.mockReturnValue(acceptedProject);

      const result = await service.acceptOrRejectRequest('request-1', true);

      expect(mockSession.run).toHaveBeenCalledWith(
        expect.stringContaining('SET p.status = $status'),
        expect.objectContaining({
          id: 'request-1',
          status: 'DRAFT',
        }),
      );
      expect(result.status).toBe('DRAFT');
      expect(mockSession.close).toHaveBeenCalled();
    });

    it('should reject a request and set status to ON_HOLD', async () => {
      const rejectedProject = {
        properties: {
          id: 'request-1',
          status: 'ON_HOLD',
        },
      };

      mockRecord.get.mockReturnValue(rejectedProject);

      const result = await service.acceptOrRejectRequest('request-1', false);

      expect(result.status).toBe('ON_HOLD');
    });

    it('should throw NotFoundException when project not found', async () => {
      const emptyResult = {
        records: [],
        summary: {} as any,
      };

      mockSession.run.mockResolvedValueOnce(emptyResult as any);

      await expect(
        service.acceptOrRejectRequest('non-existent', true),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('Error handling', () => {
    it('should close session even if error occurs', async () => {
      mockSession.run.mockRejectedValueOnce(new Error('Database error'));

      const createInput: CreateProjectInput = {
        name: 'Test',
        description: 'Test',
        clientId: '1',
        status: ProjectStatus.DRAFT,
        progress: 0,
        budgetEstime: 0,
        devise: 'EUR',
        budgetDepense: 0,
        jalonsIds: [],
        livrablesIds: [],
        cahierCharge: undefined,
        startDate: new Date().toISOString(),
        endDate: undefined,
        lastUpdatedById: '1',
        tags: [],
        demandes: [],
      };

      await expect(service.create(createInput)).rejects.toThrow('Database error');
      expect(mockSession.close).toHaveBeenCalled();
    });
  });
});
