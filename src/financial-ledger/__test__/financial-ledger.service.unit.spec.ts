import { BadRequestException, NotFoundException } from '@nestjs/common';
import { anything, instance, mock, when } from 'ts-mockito';
import { FinancialLedgerRepository } from '../financial-ledger.repository';
import { FinancialLedgerService } from '../financial-ledger.service';
import { getFinancialLedger } from './financial-ledger.fixture';
import { getUser } from './user.fixture';

describe('Financial-Ledger Service Unit Test', () => {
  let financialService: FinancialLedgerService;
  let financialRepository: FinancialLedgerRepository;

  describe('delete', () => {
    test('해당하는 가계부가 없으면 NotFoundException이 발생하는가', async () => {
      // given
      const user = getUser();
      financialRepository = mock(FinancialLedgerRepository);
      when(financialRepository.findOneBy(anything())).thenResolve(null);
      financialService = new FinancialLedgerService(
        instance(financialRepository),
      );

      // when
      const result = financialService.delete(user, 123);

      // then
      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    test('해당하는 가계부가 없으면 NotFoundException이 발생하는가', async () => {
      // given
      const user = getUser();
      financialRepository = mock(FinancialLedgerRepository);
      when(financialRepository.findOneBy(anything())).thenResolve(null);
      financialService = new FinancialLedgerService(
        instance(financialRepository),
      );

      const updatedInfo = {
        income: 10000,
        expenditure: 0,
        remarks: 'updated',
      };
      // when
      const result = financialService.update(user, 123, updatedInfo);

      // then
      await expect(result).rejects.toThrow(NotFoundException);
    });

    test('해당하는 가계부 내역이 이미 삭제되었으면 BadRequestException 발생하는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });
      financialLedger.delete();

      financialRepository = mock(FinancialLedgerRepository);
      when(financialRepository.findOneBy(anything())).thenResolve(
        financialLedger,
      );
      financialService = new FinancialLedgerService(
        instance(financialRepository),
      );

      const updatedInfo = {
        income: 10000,
        expenditure: 0,
        remarks: 'updated',
      };

      // when
      const result = financialService.update(
        user,
        financialLedger.id,
        updatedInfo,
      );

      // then
      await expect(result).rejects.toThrow(BadRequestException);
    });
  });
});
