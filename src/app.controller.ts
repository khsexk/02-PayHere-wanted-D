import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { User } from './auth/user.decorator';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}
  @Get('tokens')
  getToken(): any {
    return this.authService.getJwtAccessToken(1, 'mobile');
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getHello(@User() user) {
    console.log(`hello ${JSON.stringify(user)}`);
    return this.appService.getHello();
  }

  @UseGuards(JwtAuthGuard)
  @Get('remove')
  getRemoveTokens() {
    return this.authService.removeRefreshToken(1, 'mobile');
  }
}
