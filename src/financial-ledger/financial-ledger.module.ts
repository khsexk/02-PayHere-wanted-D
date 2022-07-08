import { Module } from '@nestjs/common';
import { FinancialLedgerController } from './financial-ledger.controller';
import { FinancialLedgerService } from './financial-ledger.service';
import { FinancialLedgerRepository } from './financial-ledger.repository';

@Module({
  controllers: [FinancialLedgerController],
  providers: [FinancialLedgerService, FinancialLedgerRepository],
})
export class FinancialLedgerModule {}
