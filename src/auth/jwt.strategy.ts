import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

/**
 * API End Point에 대해 Token이 유요한지 확인하는 class
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_ACCESS_TOKEN_SECRET,
    });
  }

  /**
   *  Custom Decorator 필요 -> UserId를 통해서 User반환해줄 수 있는 User() 데코레이터
   */
  async validate(payload: any) {
    console.log(payload.id);
    return { userId: payload.userId };
  }
}
