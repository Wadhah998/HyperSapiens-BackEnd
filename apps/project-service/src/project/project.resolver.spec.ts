import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { ProjectResolver } from './project.resolver';
import { ProjectService } from './project.service';
import { FileUploadService } from './file-upload.service';
import { DeliverableFileService } from './deliverable-file.service';
import { Driver } from 'neo4j-driver';

describe('ProjectResolver', () => {
  let resolver: ProjectResolver;
  let mockDriver: jest.Mocked<Driver>;

  beforeEach(async () => {
    mockDriver = {
      session: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProjectResolver,
        ProjectService,
        FileUploadService,
        DeliverableFileService,
        JwtService,
        {
          provide: 'NEO4J_DRIVER',
          useValue: mockDriver,
        },
      ],
    }).compile();

    resolver = module.get<ProjectResolver>(ProjectResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
