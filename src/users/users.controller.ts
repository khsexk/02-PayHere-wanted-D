import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { UserAgent } from './decorators/user-agent.decorator';
import { LogInBodyDto } from './dto/request/log-in-body.dto';
import { SingUpBodyDto } from './dto/request/sign-up-body.dto';
import { ResponseToken } from './dto/response/common/response-token.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(201)
  @Post('sign-up')
  async signUp(@Body() signUpBodyDto: SingUpBodyDto) {
    await this.usersService.signUp(signUpBodyDto);
    return null;
  }

  @HttpCode(200)
  @Post('log-in')
  async login(
    @Body() logInBodyDto: LogInBodyDto,
    @UserAgent() userAgent: string,
  ): Promise<ResponseToken> {
    const [accessToken, refreshToken] = await this.usersService.logIn(
      logInBodyDto,
      userAgent,
    );

    return new ResponseToken(accessToken, refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(200)
  @Post('log-out')
  async logout(
    @UserAgent() userAgent: string,
    @User() user,
  ): Promise<ResponseToken> {
    const [accessToken, refreshToken] = await this.usersService.logOut(
      user.id,
      userAgent,
    );

    return new ResponseToken(accessToken, refreshToken);
  }
}
