import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth-service.service';
import * as bcrypt from 'bcrypt';
import { ApolloClient } from '@apollo/client/core';

// Mock Apollo Client
jest.mock('@apollo/client/core', () => ({
  ApolloClient: jest.fn(),
  InMemoryCache: jest.fn(),
  gql: jest.fn((query) => query),
}));

// Mock bcrypt
jest.mock('bcrypt');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let mockConfigService: jest.Mocked<ConfigService>;
  let mockApolloClient: jest.Mocked<ApolloClient<any>>;

  beforeEach(async () => {
    // Mock ConfigService
    mockConfigService = {
      get: jest.fn(),
    } as any;

    // Mock Apollo Client query method
    mockApolloClient = {
      query: jest.fn(),
    } as any;

    // Mock ApolloClient constructor
    (ApolloClient as jest.Mock).mockImplementation(() => mockApolloClient);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: ConfigService,
          useValue: mockConfigService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('validateUser', () => {
    const email = 'test@example.com';
    const password = 'password123';
    const hashedPassword = '$2b$10$hashedPassword';

    it('should validate user with correct credentials', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'CLIENT',
        password: hashedPassword,
      };

      mockApolloClient.query.mockResolvedValue({
        data: {
          userByEmail: mockUser,
        },
      } as any);

      mockedBcrypt.compare.mockResolvedValue(true as never);

      const result = await service.validateUser(email, password);

      expect(mockApolloClient.query).toHaveBeenCalledWith(
        expect.objectContaining({
          variables: { email },
        }),
      );
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toEqual(mockUser);
    });

    it('should return null for invalid password', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        role: 'CLIENT',
        password: hashedPassword,
      };

      mockApolloClient.query.mockResolvedValue({
        data: {
          userByEmail: mockUser,
        },
      } as any);

      mockedBcrypt.compare.mockResolvedValue(false as never);

      const result = await service.validateUser(email, password);

      expect(mockedBcrypt.compare).toHaveBeenCalledWith(password, hashedPassword);
      expect(result).toBeNull();
    });

    it('should return null when user not found', async () => {
      mockApolloClient.query.mockResolvedValue({
        data: {
          userByEmail: null,
        },
      } as any);

      const result = await service.validateUser(email, password);

      expect(mockedBcrypt.compare).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it('should return null when GraphQL query fails', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockApolloClient.query.mockRejectedValue(new Error('GraphQL error'));

      const result = await service.validateUser(email, password);

      expect(consoleErrorSpy).toHaveBeenCalled();
      expect(result).toBeNull();

      consoleErrorSpy.mockRestore();
    });

    it('should handle empty user data', async () => {
      mockApolloClient.query.mockResolvedValue({
        data: {},
      } as any);

      const result = await service.validateUser(email, password);

      expect(result).toBeNull();
    });
  });

  describe('getHello', () => {
    it('should return empty string', () => {
      const result = service.getHello();
      expect(result).toBe('');
    });
  });
});

