import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
} from '@nestjs/common';

export const UserAgent = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const { headers } = ctx.switchToHttp().getRequest();
    if (!headers['user-agent'] || !headers['user-agent'].length) {
      throw new BadRequestException('User-Agent 값은 필수입니다.');
    } else {
      return headers['user-agent'];
    }
  },
);
