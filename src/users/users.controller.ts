import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiHeader, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/auth/user.decorator';
import { CommonResponseDto } from 'src/common/dto/response/common-response.dto';
import { UserAgent } from './decorators/user-agent.decorator';
import { LogInBodyDto } from './dto/request/log-in-body.dto';
import { SingUpBodyDto } from './dto/request/sign-up-body.dto';
import { ResponseTokenLogOut } from './dto/response/common/response-token-logout.dto';
import { ResponseToken } from './dto/response/common/response-token.dto';
import { UsersService } from './users.service';

@ApiTags('User')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원 가입' })
  @ApiBody({ type: SingUpBodyDto })
  @ApiCreatedResponse({
    description: '회원 가입 성공',
    schema: {
      example: new CommonResponseDto(201, null)
    }
  })
  @HttpCode(201)
  @Post('sign-up')
  async signUp(@Body() signUpBodyDto: SingUpBodyDto) {
    await this.usersService.signUp(signUpBodyDto);
    return null;
  }

  @ApiOperation({ summary: '로그인' })
  @ApiHeader({ 
    name: 'User-Agent',
    description: 'Http Header의 User-Agent 속성', 
    schema: {
      example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    } 
  })
  @ApiBody({ type: LogInBodyDto })
  @ApiOkResponse({
    type: ResponseToken,
    description: '로그인 성공',
  })
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

  @ApiOperation({ summary: '로그아웃' })
  @ApiHeader({ 
    name: 'User-Agent',
    description: 'Http Header의 User-Agent 속성', 
    schema: {
      example: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/103.0.0.0 Safari/537.36'
    } 
  })
  @ApiOkResponse({
    type: ResponseTokenLogOut,
    description: '로그아웃 성공',
  })
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
