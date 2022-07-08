import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../entities/User';
import { Repository } from 'typeorm';
import { Token } from '../entities/Token';
import { AuthService } from './auth.service';
import { NotFoundException } from '@nestjs/common';

const mockPostRepository = () => ({
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
  createQueryBuilder: jest.fn(),
  delete: jest.fn(),
});
/**
 * MockRepository Type 지정
 */
type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('AuthService', () => {
  let service: AuthService;
  let tokenRepository: MockRepository<Token>;
  let userRepository: MockRepository<User>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        // 사용하는 Repository -> Mock 이용하여 Value 지정
        {
          provide: getRepositoryToken(Token),
          useValue: mockPostRepository(),
        },
        {
          provide: getRepositoryToken(User),
          useValue: mockPostRepository(),
        },
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    tokenRepository = module.get<MockRepository<Token>>(
      getRepositoryToken(Token),
    );
    userRepository = module.get<MockRepository<Token>>(
      getRepositoryToken(User),
    );
  });
  describe('예외 처리 부문', () => {
    it('잘못된 userId로 접근 시 null 값으로 return', async () => {
      const userId = 1;
      const userAgent = 'mobile';
      const createQueryBuilder: any = {
        select: () => createQueryBuilder,
        leftJoinAndSelect: () => createQueryBuilder,
        getMany: () => null,
      };
      jest
        .spyOn(tokenRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const result = await service.getTokenEntity(userId, userAgent);
      expect(result).toBe(null);
    });
  });

  describe('만료일자 계산', () => {
    it('RefreshToken이 env에서 지정한 만료일로 저장되는지 테스트', async () => {
      const date: Date = new Date();
      const result = service.addDays(date, 14);
      date.setDate(date.getDate() + 14);

      expect(result).toBe(date);
    });
  });

  describe('로그아웃 시 토큰', () => {
    const userId = 1;
    const userAgent = 'mobile';
    it('토큰이 없는 경우 NotFoundException 발생', async () => {
      const token = null;
      const createQueryBuilder: any = {
        select: () => createQueryBuilder,
        leftJoinAndSelect: () => createQueryBuilder,
        getMany: () => token,
      };
      jest
        .spyOn(tokenRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      const result = service.removeRefreshToken(userId, userAgent);
      expect(result).rejects.toThrow(new NotFoundException());
    });

    it('userAgent와 userId에 따른 Token 삭제 성공', async () => {
      const tokenId = 1;
      const token = [
        {
          id: tokenId,
          userAgent: userAgent,
          user: {
            id: userId,
          },
        },
        {
          id: 3,
          userAgent: 'browser',
          user: {
            id: 4,
          },
        },
      ];
      const createQueryBuilder: any = {
        select: () => createQueryBuilder,
        leftJoinAndSelect: () => createQueryBuilder,
        getMany: () => token,
      };
      jest
        .spyOn(tokenRepository, 'createQueryBuilder')
        .mockImplementation(() => createQueryBuilder);

      jest.spyOn(tokenRepository, 'delete').mockResolvedValue(true);
      const result = await service.removeRefreshToken(userId, userAgent);
      expect(result).toEqual({
        data: {
          id: 1,
          userAgent: 'mobile',
        },
        message: '토큰이 삭제되었습니다.',
      });
    });
  });
});
