import { Test } from '@nestjs/testing';
import { User } from '../entities/User';
import { AuthService } from '../auth/auth.service';
import { DeviceDetectorService } from '../common/device-detector/device-detector.service';
import { HashingService } from '../common/hashing/hashing.service';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';
import { SingUpBodyDto } from './dto/request/sign-up-body.dto';
import { faker } from '@faker-js/faker';
import { LogInBodyDto } from './dto/request/log-in-body.dto';
import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;
  let hashingService: HashingService;
  let deviceDetectorService: DeviceDetectorService;
  let authService: AuthService;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: UsersRepository,
          useValue: {
            findUserByEmail: jest.fn((email: string) => {
              const user = new User();
              user.email = email;
              return user;
            }),
            createUser: jest.fn((user: User) => {
              return {
                identifiers: [{ id: user['id'] }],
              };
            }),
          },
        },
        {
          provide: HashingService,
          useValue: {
            hash: jest.fn((anyString: string) => {
              return faker.datatype.uuid();
            }),
            compare: jest.fn((anyString: string, encryptedString: string) => {
              return true;
            }),
          },
        },
        {
          provide: DeviceDetectorService,
          useValue: {
            parse: jest.fn((userAgent: string) => {
              return faker.datatype.uuid();
            }),
          },
        },
        {
          provide: AuthService,
          useValue: {
            getJwtAccessToken: jest.fn((userId: number, userAgent: string) => {
              return {
                accessToken: faker.datatype.uuid(),
                refreshToken: faker.datatype.uuid(),
                token: {
                  identifiers: [{ id: 1 }],
                },
              };
            }),
            removeRefreshToken: jest.fn((userId: number, userAgent: string) => {
              return;
            }),
          },
        },
      ],
    }).compile();

    usersService = moduleRef.get<UsersService>(UsersService);
    usersRepository = moduleRef.get<UsersRepository>(UsersRepository);
    hashingService = moduleRef.get<HashingService>(HashingService);
    deviceDetectorService = moduleRef.get<DeviceDetectorService>(
      DeviceDetectorService,
    );
    authService = moduleRef.get<AuthService>(AuthService);
  });

  describe('회원가입', () => {
    it('실패 - 이미 회원가입된 유저가 존재하는 경우', async () => {
      // given
      const signUpBodyDto = new SingUpBodyDto();
      signUpBodyDto.email = faker.internet.email();
      signUpBodyDto.password = faker.datatype.uuid();

      try {
        await usersService.signUp(signUpBodyDto);
      } catch (err) {
        // then
        expect(err).toEqual(
          new ConflictException('이미 회원가입된 유저입니다.'),
        );
      }
    });

    it('성공 - 회원가입 성공', async () => {
      // given
      const signUpBodyDto = new SingUpBodyDto();
      signUpBodyDto.email = faker.internet.email();
      signUpBodyDto.password = faker.datatype.uuid();

      // when
      jest
        .spyOn(usersRepository, 'findUserByEmail')
        .mockResolvedValue(undefined);

      await usersService.signUp(signUpBodyDto);

      // then
      expect(hashingService.hash).toBeCalledTimes(1);
      expect(usersRepository.createUser).toBeCalledTimes(1);
    });
  });

  describe('로그인', () => {
    it('실패 - 이메일이 일치하지 않는 경우', async () => {
      // given
      const logInBodyDto = new LogInBodyDto();
      logInBodyDto.email = faker.internet.email();
      logInBodyDto.password = faker.datatype.uuid();

      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36';

      // when
      jest
        .spyOn(usersRepository, 'findUserByEmail')
        .mockResolvedValue(undefined);

      try {
        await usersService.logIn(logInBodyDto, userAgent);
      } catch (err) {
        // then
        expect(err).toEqual(new NotFoundException('존재하지 않는 유저입니다.'));
      }
    });

    it('실패 - 비밀번호가 일치하지 않는 경우', async () => {
      // given
      // given
      const logInBodyDto = new LogInBodyDto();
      logInBodyDto.email = faker.internet.email();
      logInBodyDto.password = faker.datatype.uuid();

      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36';

      jest.spyOn(hashingService, 'compare').mockResolvedValue(false);

      try {
        await usersService.logIn(logInBodyDto, userAgent);
      } catch (err) {
        // then
        expect(err).toEqual(
          new BadRequestException('비밀번호가 일치하지 않습니다.'),
        );
      }
    });

    it('성공 - 로그인 성공, 토큰 반환', async () => {
      // given
      // given
      const logInBodyDto = new LogInBodyDto();
      logInBodyDto.email = faker.internet.email();
      logInBodyDto.password = faker.datatype.uuid();

      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36';

      const result = await usersService.logIn(logInBodyDto, userAgent);

      // then
      expect(hashingService.compare).toBeCalledTimes(1);
      expect(deviceDetectorService.parse).toBeCalledTimes(1);
      expect(authService.getJwtAccessToken).toBeCalledTimes(1);
      expect(result).toHaveLength(2);
    });
  });

  describe('로그아웃', () => {
    it('성공 - 로그아웃 성공', async () => {
      // given
      const userId = 1;
      const userAgent =
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36';

      const result = await usersService.logOut(userId, userAgent);

      // then
      expect(deviceDetectorService.parse).toBeCalledTimes(1);
      expect(authService.removeRefreshToken).toBeCalledTimes(1);
      expect(result).toHaveLength(2);
    });
  });
});
