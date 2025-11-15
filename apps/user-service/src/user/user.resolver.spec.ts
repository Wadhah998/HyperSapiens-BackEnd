import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { Driver } from 'neo4j-driver';
import { EmailService } from '../../../../Libs/shared/EmailService';

// Mock EmailService
const mockEmailService = {
  sendEmail: jest.fn(),
};

describe('UserResolver', () => {
  let resolver: UserResolver;
  let mockDriver: jest.Mocked<Driver>;

  beforeEach(async () => {
    mockDriver = {
      session: jest.fn(),
    } as any;

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserResolver,
        UserService,
        JwtService,
        {
          provide: 'NEO4J_DRIVER',
          useValue: mockDriver,
        },
        {
          provide: EmailService,
          useValue: mockEmailService,
        },
      ],
    }).compile();

    resolver = module.get<UserResolver>(UserResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
