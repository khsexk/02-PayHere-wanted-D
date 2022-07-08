import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource, Not, IsNull } from 'typeorm';
import { clearDatabase } from '../../../test/utils/clear-database';
import { TypeOrmTestConfig } from '../../../test/utils/typeorm-test-config';
import { FinancialLedger } from '../../entities/FinancialLedger';
import { FinancialLedgerRepository } from '../financial-ledger.repository';
import { FinancialLedgerService } from '../financial-ledger.service';
import { getFinancialLedger } from './financial-ledger.fixture';
import { getUser } from './user.fixture';

describe('FinancialLedgerService', () => {
  let service: FinancialLedgerService;
  let repository: FinancialLedgerRepository;
  let dataSource: DataSource;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TypeOrmModule.forRoot(TypeOrmTestConfig)],
      providers: [FinancialLedgerService, FinancialLedgerRepository],
    }).compile();

    service = module.get<FinancialLedgerService>(FinancialLedgerService);
    repository = module.get<FinancialLedgerRepository>(
      FinancialLedgerRepository,
    );
    dataSource = module.get(DataSource);
  });

  afterEach(async () => {
    await clearDatabase(dataSource);
    await dataSource.destroy();
  });

  describe('delete', () => {
    test('해당하는 가계부 내역이 삭제되는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });
      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      // when
      const result = service.delete(user, financialLedger.id);

      // then
      await expect(result).resolves.toEqual(undefined);
      const savedFinancialLedger = await em.findOneBy(FinancialLedger, {
        id: financialLedger.id,
      });
      expect(savedFinancialLedger.deletedAt).not.toBeNull();
    });

    test('해당하는 가계부가 없으면 NotFoundException이 발생하는가', async () => {
      // given
      const user = getUser();
      await dataSource.createEntityManager().save(user);
      // when
      const result = service.delete(user, 1);
      // then
      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    test('해당하는 가계부 내역이 수정되는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });
      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      // when
      const result = service.update(user, financialLedger.id, {
        income: 100000,
        expenditure: 0,
        remarks: 'updated',
      });

      // then
      await expect(result).resolves.toEqual(undefined);
      const savedFinancialLedger = await em.findOneBy(FinancialLedger, {
        id: financialLedger.id,
      });
      expect(savedFinancialLedger).not.toBeNull();
      expect(savedFinancialLedger).toMatchObject({
        income: 100000,
        expenditure: 0,
        remarks: 'updated',
      });
    });

    test('해당하는 가계부가 없으면 NotFoundException이 발생하는가', async () => {
      // given
      const user = getUser();
      await dataSource.createEntityManager().save(user);
      // when
      const result = service.update(user, 1, {
        income: 0,
        expenditure: 0,
        remarks: 'updated',
      });
      // then
      await expect(result).rejects.toThrow(NotFoundException);
    });
  });

  describe('restore', () => {
    test('해당하는 삭제된 가계부 내역의 deletedAt값이 null로 변경되는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });
      financialLedger.deletedAt = new Date();
      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      // when
      const result = service.restore(user, financialLedger.id);

      // then
      await expect(result).resolves.toBeUndefined();
    });

    test('해당하는 가계부 내역이 없으면 NotFoundException이 발생하는가', async () => {
      // given
      const user = getUser();
      const em = dataSource.createEntityManager();
      await em.save(user);

      // when
      const result = service.restore(user, 123);

      // then
      await expect(result).rejects.toThrow(NotFoundException);
    });

    test('해당하는 가계부 내역이 삭제된 내역이 아니면 BadRequestException이 발생하는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });
      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      // when
      const result = service.restore(user, financialLedger.id);

      // then
      await expect(result).rejects.toThrow(BadRequestException);
    });
  });

  describe('create', () => {
    it('글 작성이 잘 되는가', async () => {
      // Given
      const user = getUser();
      const em = dataSource.createEntityManager();
      await em.save(user);

      // When
      const result = repository.createMemo(
        {
          expenditure: 1000,
          income: 500,
          remarks: 'memo',
          date: new Date('2020-07-07'),
        },
        user,
      );

      // Then
      await expect(result).resolves.toBeDefined();
    });
  });

  describe('readOne', () => {
    it('본인 글이 아니거나 삭제되거나 없는 가계부를 확인하려할때 NotFoundException 발생하는가', async () => {
      // Given
      const user = getUser();
      const em = dataSource.createEntityManager();
      await em.save(user);

      try {
        // When
        const result = await repository.getOneMemo(1, user.id);
        // Then
        expect(result).resolves.toEqual(UnauthorizedException);
      } catch (e) {}
    });
  });

  describe('readList', () => {
    it('로그인을 하지않고 리스트를 조회할때 UnauthorizedException 발생하는가', async () => {
      // Given
      const user = getUser();
      const em = dataSource.createEntityManager();
      await em.save(user);

      try {
        // When
        const result = await repository.getAllMemo(user.id);
        // Then
        expect(result).toThrowError(UnauthorizedException);
      } catch (e) {}
    });
  });
});
