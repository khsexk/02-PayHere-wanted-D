import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/entities/Token';
import { User } from 'src/entities/User';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt-auth.guard';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [TypeOrmModule.forFeature([Token, User])],
  providers: [AuthService, JwtService, JwtStrategy, JwtAuthGuard],
  exports: [AuthService],
})
export class AuthModule {}
