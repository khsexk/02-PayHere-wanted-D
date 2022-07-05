import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 *  사용 예시 @UseGuards(JwtAuthGuard)
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
