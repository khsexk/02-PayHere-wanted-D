import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  getJwtAccessToken(user: any) {
    // Get Access Token Function
    const payload = { id: user.id };
    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s`,
    });

    return {
      accessToken: accessToken,
      refreshToken: this.getJwtRefreshToken(user),
    };
  }

  getJwtRefreshToken(user: any) {
    // Get Refresh Token Function
    const payload = { id: user.id };
    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_TOKEN_SECRET,
      expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s`,
    });

    return refreshToken;
  }
}
