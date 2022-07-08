import { HttpStatus, INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import * as request from 'supertest';
import { FinancialLedgerModule } from '../src/financial-ledger/financial-ledger.module';
import { getFinancialLedger } from '../src/financial-ledger/__test__/financial-ledger.fixture';
import { getUser } from '../src/financial-ledger/__test__/user.fixture';
import { TypeOrmTestConfig } from './utils/typeorm-test-config';
import { UpdateRequestDto } from '../src/financial-ledger/dto/update-request.dto';
import { AuthModule } from '../src/auth/auth.module';
import { AccessToken } from './utils/access-token';
import { FinancialLedger } from '../src/entities/FinancialLedger';
import { clearDatabase } from './utils/clear-database';

describe('FinancialLedger E2E Test', () => {
  const root = '/financial-ledgers';
  let app: INestApplication;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [
        AuthModule,
        TypeOrmModule.forRoot(TypeOrmTestConfig),
        FinancialLedgerModule,
      ],
    }).compile();

    app = module.createNestApplication();
    dataSource = app.get(DataSource);
    await app.init();
  });

  afterAll(async () => {
    await clearDatabase(dataSource);
    await dataSource.destroy();
    await app.close();
  });

  describe('PUT /financial-ledgers/:id', () => {
    const url = (id: number) => `${root}/${id}`;

    test('해당하는 가계부 내역의 수입, 지출, 메모가 수정하고 204를 리턴하는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });

      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      const accessToken = AccessToken.of(user);

      const body: UpdateRequestDto = {
        income: 10000,
        expenditure: 0,
        remarks: 'updated',
      };

      // when
      await request(app.getHttpServer())
        .put(url(financialLedger.id))
        .set({ ...accessToken.authorizationHeaderForm })
        .send(body)
        .expect(HttpStatus.NO_CONTENT);

      // then
      const savedFinancialLedger = await em.findOneBy(FinancialLedger, {
        id: financialLedger.id,
      });

      expect(savedFinancialLedger).toMatchObject({
        income: 10000,
        expenditure: 0,
        remarks: 'updated',
      });
    });

    test('토큰이 유효하지 않으면 401을 반환하는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });

      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      const body: UpdateRequestDto = {
        income: 10000,
        expenditure: 0,
        remarks: 'updated',
      };

      // when
      const res = await request(app.getHttpServer())
        .put(url(financialLedger.id))
        .send(body)
        .expect(HttpStatus.UNAUTHORIZED);

      // then
      expect(res.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });

    test('가계부 내역이 존재하지 않으면 404를 반환하는가', async () => {
      // given
      const user = getUser();

      const em = dataSource.createEntityManager();
      await em.save(user);

      const accessToken = AccessToken.of(user);

      const body: UpdateRequestDto = {
        income: 10000,
        expenditure: 0,
        remarks: 'updated',
      };

      // when
      const res = await request(app.getHttpServer())
        .put(url(123))
        .set({ ...accessToken.authorizationHeaderForm })
        .send(body)
        .expect(HttpStatus.NOT_FOUND);

      // then
      expect(res.body).toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
        message: '해당하는 가계부 내역이 존재하지 않습니다',
      });
    });

    test('가계부 내역이 삭제되었다면 401을 반환하는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });
      financialLedger.delete();

      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      const accessToken = AccessToken.of(user);

      const body: UpdateRequestDto = {
        income: 10000,
        expenditure: 0,
        remarks: 'updated',
      };

      // when
      const res = await request(app.getHttpServer())
        .put(url(financialLedger.id))
        .set({ ...accessToken.authorizationHeaderForm })
        .send(body)
        .expect(HttpStatus.BAD_REQUEST);

      // then
      expect(res.body).toMatchObject({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '삭제된 가계부 내역입니다',
      });
    });
  });
  describe('PUT /financial-ledgers/:id/cancellation', () => {
    const url = (id: number) => `${root}/${id}/cancellation`;

    test('해당하는 가계부 내역을 삭제하고 204를 리턴하는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });

      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      const accessToken = AccessToken.of(user);

      // when
      await request(app.getHttpServer())
        .put(url(financialLedger.id))
        .set({ ...accessToken.authorizationHeaderForm })
        .expect(HttpStatus.NO_CONTENT);

      // then
      const savedFinancialLedger = await em.findOneBy(FinancialLedger, {
        id: financialLedger.id,
      });

      expect(savedFinancialLedger).toMatchObject({
        deletedAt: expect.any(Date),
      });
    });

    test('토큰이 유효하지 않으면 401을 반환하는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });

      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      // when
      const res = await request(app.getHttpServer())
        .put(url(financialLedger.id))
        .expect(HttpStatus.UNAUTHORIZED);

      // then
      expect(res.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });

    test('가계부 내역이 존재하지 않으면 404를 반환하는가', async () => {
      // given
      const user = getUser();

      const em = dataSource.createEntityManager();
      await em.save(user);

      const accessToken = AccessToken.of(user);

      // when
      const res = await request(app.getHttpServer())
        .put(url(123))
        .set({ ...accessToken.authorizationHeaderForm })
        .expect(HttpStatus.NOT_FOUND);

      // then
      expect(res.body).toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
        message: '해당하는 가계부 내역이 존재하지 않습니다',
      });
    });

    test('이미 삭제된 가계부 내역인 경우 401을 반환하는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });
      financialLedger.delete();

      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      const accessToken = AccessToken.of(user);

      // when
      const res = await request(app.getHttpServer())
        .put(url(financialLedger.id))
        .set({ ...accessToken.authorizationHeaderForm })
        .expect(HttpStatus.BAD_REQUEST);

      // then
      expect(res.body).toMatchObject({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '이미 삭제된 가계부 내역 입니다',
      });
    });
  });

  describe('PUT /financial-ledgers/:id/restoration', () => {
    const url = (id: number) => `${root}/${id}/restoration`;

    test('해당하는 삭제된 가게부 내역을 복구하고 204를 반환하는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });
      financialLedger.delete();

      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      const accessToken = AccessToken.of(user);

      // when
      await request(app.getHttpServer())
        .put(url(financialLedger.id))
        .set({ ...accessToken.authorizationHeaderForm })
        .expect(HttpStatus.NO_CONTENT);

      // then
      const savedFinancialLedger = await em.findOneBy(FinancialLedger, {
        id: financialLedger.id,
      });

      expect(savedFinancialLedger).toMatchObject({
        deletedAt: null,
      });
    });

    test('토큰이 유효하지 않으면 401을 반환하는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });
      financialLedger.delete();

      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      // when
      const res = await request(app.getHttpServer())
        .put(url(financialLedger.id))
        .expect(HttpStatus.UNAUTHORIZED);

      // then
      expect(res.body).toMatchObject({
        statusCode: 401,
        message: 'Unauthorized',
      });
    });

    test('가계부 내역이 존재하지 않으면 404를 반환하는가', async () => {
      // given
      const user = getUser();

      const em = dataSource.createEntityManager();
      await em.save(user);

      const accessToken = AccessToken.of(user);

      // when
      const res = await request(app.getHttpServer())
        .put(url(123))
        .set({ ...accessToken.authorizationHeaderForm })
        .expect(HttpStatus.NOT_FOUND);

      // then
      expect(res.body).toMatchObject({
        statusCode: HttpStatus.NOT_FOUND,
        message: '해당하는 가계부 내역이 존재하지 않습니다',
      });
    });

    test('삭제된 가계부 내역이 아닌 경우 401을 반환하는가', async () => {
      // given
      const user = getUser();
      const financialLedger = getFinancialLedger({ user });

      const em = dataSource.createEntityManager();
      await em.save(user);
      await em.save(financialLedger);

      const accessToken = AccessToken.of(user);

      // when
      const res = await request(app.getHttpServer())
        .put(url(financialLedger.id))
        .set({ ...accessToken.authorizationHeaderForm })
        .expect(HttpStatus.BAD_REQUEST);

      // then
      expect(res.body).toMatchObject({
        statusCode: HttpStatus.BAD_REQUEST,
        message: '삭제되지 않은 가계부 내역 입니다',
      });
    });
  });
});
