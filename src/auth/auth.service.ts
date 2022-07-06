import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { compare, hash } from 'bcrypt';
import { Token } from 'src/entities/Token';
import { User } from 'src/entities/User';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(Token) // tokenRepository 가져오기
    private tokenRepository: Repository<Token>,

    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  /**
   * 액세스 토큰과 리프레시 토큰 생성 함수
   * User Module에서 로그인 시 -> getJwtAccessToken 함수를 호출해야 함.
   * + 재발급 가능
   */
  async getJwtAccessToken(userId: number, userAgent: string) {
    const payload = { id: userId, agent: userAgent };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}h`,
    });
    const result = await this.getJwtRefreshToken(userId, userAgent);
    return {
      accessToken: accessToken,
      refreshToken: result.refreshToken,
      token: result.tokenDto,
    };
  }

  /**
   * 리프레시 토큰 생성 함수
   * getJwtAccessToken 함수에서 this.getJwtRefreshToken을 이용해 만료기간이 더 긴
   * RefreshToken까지 발급
   */
  async getJwtRefreshToken(userId: number, userAgent: string) {
    // Get Refresh Token Function
    const payload = { id: userId, agent: userAgent };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}d`,
    });

    // Database에 저장
    const tokenDto = await this.setCurrentRefreshToken(
      refreshToken,
      userId,
      userAgent,
    );

    const result = {
      refreshToken: refreshToken,
      tokenDto: tokenDto,
    };

    return result;
  }

  /**
   *  AccessToken 만료시 Refresh Token 비교 후 새롭게 반환
   */
  async refreshToken(refreshToken: string, userId: number, userAgent: string) {
    const token = await this.getTokenEntity(userId, userAgent);
    if (!token) throw new UnauthorizedException();

    const isMatch = await compare(refreshToken, token.token);
    if (!isMatch) throw new ForbiddenException('Access Denied');

    return await this.getJwtAccessToken(userId, userAgent);
  }

  /**
   * Token Entity에 유저에 따른 Token을 저장하기 위한 함수
   */
  async setCurrentRefreshToken(
    refreshToken: string,
    userId: number,
    userAgent: string,
  ) {
    // DB에 토큰 값 저장
    const currentHashedRefreshToken = await hash(refreshToken, 10); // bcrypt의 hash 를 이용하여 암호화하여 저장
    const user = await this.userRepository.findOne({ where: { id: userId } }); // userId로 user 가져오기
    if (!user) {
      throw new HttpException('Not Exists userId', HttpStatus.NOT_FOUND);
    }

    let tokenEntity = await this.getTokenEntity(userId, userAgent);

    if (tokenEntity) {
      // userId와 userAgent에 따른 토큰이 존재한다면
      tokenEntity.token = currentHashedRefreshToken;
      await this.tokenRepository.save(tokenEntity);
    } else {
      //해당되는 userId와 userAgent에 따른 토큰이 없다면 새롭게 생성
      tokenEntity = await this.tokenRepository
        .createQueryBuilder()
        .insert()
        .into(Token)
        .values([
          {
            token: currentHashedRefreshToken,
            userAgent: userAgent,
            user: user,
            expiredAt: this.addDays(
              new Date(),
              parseInt(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME),
            ),
          },
        ])
        .execute();
    }
    return tokenEntity;
  }

  /**
   *  User 로그 아웃시 -> Token Value null 처리
   */
  async removeRefreshToken(userId: number, userAgent: string) {
    const token = await this.getTokenEntity(userId, userAgent);
    if (token) {
      await this.tokenRepository.delete(token.id);
    } else {
      throw new NotFoundException();
    }
  }

  /**
   * 원하는 Token Entity 찾는 Funtion
   */
  async getTokenEntity(userId: number, userAgent: string) {
    let tokenEntity = null;
    const tokens = await this.tokenRepository
      .createQueryBuilder('token')
      .leftJoinAndSelect('token.user', 'user')
      .getMany();

    tokens.forEach((token) => {
      if (token.userAgent === userAgent && token.user.id === userId) {
        tokenEntity = token;
        delete tokenEntity.user;
      }
    });

    return tokenEntity;
  }

  /**
   * 만료일자 14일 더해주는 함수
   */
  addDays(date: Date, days: number): Date {
    date.setDate(date.getDate() + days);
    return date;
  }
}
