import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FinancialLedgerModule } from './financial-ledger/financial-ledger.module';
import * as ormConfig from '../ormConfig';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { FinancialLedgerInterceptor } from './financial-ledger/interceptor/financial-ledger.interceptor';
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
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: FinancialLedgerInterceptor,
    },
  ],
})
export class AppModule {}
