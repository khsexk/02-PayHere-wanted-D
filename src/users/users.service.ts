import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { DeviceDetectorService } from '../common/device-detector/device-detector.service';
import { HashingService } from '../common/hashing/hashing.service';
import { User } from '../entities/User';
import { LogInBodyDto } from './dto/request/log-in-body.dto';
import { SingUpBodyDto } from './dto/request/sign-up-body.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly hashingService: HashingService,
    private readonly deviceDetectorService: DeviceDetectorService,
    private readonly authService: AuthService,
  ) {}

  async isExistUser(email: string): Promise<User> {
    return this.usersRepository.findUserByEmail(email);
  }

  async signUp(signUpBodyDto: SingUpBodyDto) {
    const { email, password } = signUpBodyDto;

    // email 중복 체크
    const user = await this.isExistUser(email);
    if (user) throw new ConflictException('이미 회원가입된 유저입니다.');

    // 비밀번호 해싱
    const encryptedPassword = await this.hashingService.hash(password);

    const newUser = new User();
    newUser.email = email;
    newUser.password = encryptedPassword;

    await this.usersRepository.createUser(newUser);
  }

  async logIn(logInBodyDto: LogInBodyDto, userAgent: string) {
    const { email, password } = logInBodyDto;

    const user = await this.isExistUser(email);

    if (!user) throw new NotFoundException('존재하지 않는 유저입니다.');

    // 비밀번호 비교
    const isMatch = await this.hashingService.compare(password, user.password);

    if (!isMatch)
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');

    const parsedUserAgent = await this.deviceDetectorService.parse(userAgent);

    // 토큰 생성
    const createdToken = await this.authService.getJwtAccessToken(
      user.id,
      parsedUserAgent,
    );

    return [createdToken.accessToken, createdToken.refreshToken];
  }

  async logOut(userId: number, userAgent: string) {
    const parsedUserAgent = await this.deviceDetectorService.parse(userAgent);

    // 리프레시 토큰 삭제
    await this.authService.removeRefreshToken(userId, parsedUserAgent);

    return [null, null];
  }
}
