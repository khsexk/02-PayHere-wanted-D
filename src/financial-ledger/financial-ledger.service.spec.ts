import { Test, TestingModule } from '@nestjs/testing';
import { FinancialLedgerService } from './financial-ledger.service';

describe('FinancialLedgerService', () => {
  let service: FinancialLedgerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FinancialLedgerService],
    }).compile();

    service = module.get<FinancialLedgerService>(FinancialLedgerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
