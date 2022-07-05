import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash } from 'bcrypt';
import { Token } from 'src/entities/Token';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(Token) // tokenRepository 가져오기
    private tokenRepository: Repository<Token>,
  ) {}

  /**
   * 액세스 토큰과 리프레시 토큰 생성 함수
   * User Module에서 로그인 시 -> getJwtAccessToken 함수를 호출해야 함.
   */
  getJwtAccessToken(userId: number, userAgent: string) {
    const payload = { id: userId, agent: userAgent };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });
    return {
      accessToken: accessToken,
      refreshToken: this.getJwtRefreshToken(userId, userAgent),
    };
  }

  /**
   * 리프레시 토큰 생성 함수
   * getJwtAccessToken 함수에서 this.getJwtRefreshToken을 이용해 만료기간이 더 긴
   * RefreshToken까지 발급
   */
  getJwtRefreshToken(userId: number, userAgent: string) {
    // Get Refresh Token Function
    const payload = { id: userId, agent: userAgent };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`,
    });

    // Database에 저장
    this.setCurrentRefreshToken(refreshToken, userId, userAgent);

    return refreshToken;
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
    await this.tokenRepository.save({
      userId,
      currentHashedRefreshToken,
      userAgent,
    });
  }
}
