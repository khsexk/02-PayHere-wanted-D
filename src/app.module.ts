import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialLedgerModule } from './financial-ledger/financial-ledger.module';
import * as ormConfig from '../ormConfig';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(ormConfig),
    AuthModule,
    FinancialLedgerModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
