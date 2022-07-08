import { Injectable, NotFoundException } from '@nestjs/common';
import { User } from 'src/entities/User';
import { DataSource, Repository } from 'typeorm';
import { FinancialLedger } from '../entities/FinancialLedger';
import { FinancialLedgerGroupDto } from './dto/financial-ledger.group.dto';
import { FinancialLedgerListDto } from './dto/financial-ledger.list.dto';
import { FinancialLedgerWriteDto } from './dto/financial-ledger.write.dto';

@Injectable()
export class FinancialLedgerRepository extends Repository<FinancialLedger> {
  constructor(private readonly dataSource: DataSource) {
    super(
      FinancialLedger,
      dataSource.createEntityManager(),
      dataSource.createQueryRunner(),
    );
  }

  //가계부 작성
  async createMemo(
    financialLedgerWriteDto: FinancialLedgerWriteDto,
    user: User,
  ) {
    const { expenditure, income, date, remarks } = financialLedgerWriteDto;

    const memo = this.create({
      user: { id: user.id },
      expenditure: expenditure,
      income: income,
      date: date,
      remarks: remarks,
    });

    return await this.save(memo);
  }

  //가계부 1개내역 상세보기
  async getOneMemo(id: number, userId: number) {
    const data = await this.createQueryBuilder('FinancialLedger')
      .where('id = :id', {
        id: id,
      })
      .andWhere('userId = :uid', {
        uid: userId,
      })
      .andWhere('deletedAt IS NULL')
      .getOne();

    if (!data) {
      throw new NotFoundException('해당하는 가계부 내역을 찾을 수 없습니다.');
    }

    return data;
  }

  //가계부 전체 리스트 조회
  async getAllMemo(userId: number) {
    const groupData = await this.findDayGroup(userId);
    const userData = await this.findUserList(userId);

    return { groupData, userData };
  }

  //하루단위 그룹 데이터 (yyyy-mm-dd, 사용금액총량, 동일날짜인 메모 아이디)
  async findDayGroup(userId: number): Promise<FinancialLedgerGroupDto[]> {
    const data = await this.createQueryBuilder('FinancialLedger')
      .select([
        `DATE_FORMAT(date,'%Y/%m/%d') AS day_date`,
        `SUM(income) - SUM(expenditure) AS today_sum`,
        `group_concat(id) as 'idxs'`,
      ])
      .where('userId = :uid', {
        uid: userId,
      })
      .andWhere('deletedAt IS NULL') //삭제된 기록이 없을때 by 최아름
      .groupBy('day_date')
      .orderBy('day_date', 'DESC')
      .getRawMany();

    return data;
  }

  //유저가 작성한 전체 리스트
  async findUserList(userId: number): Promise<FinancialLedgerListDto[]> {
    const todayList = await this.createQueryBuilder('FinancialLedger')
      .select([
        'id',
        `DATE_FORMAT(date,'%Y/%m/%d') AS day_date`,
        'expenditure',
        'income',
        'remarks',
      ])
      .where('userId = :uid', {
        uid: userId,
      })
      .andWhere('deletedAt IS NULL')
      .orderBy('day_date', 'DESC')
      .addOrderBy('id', 'DESC')
      .getRawMany();

    return todayList;
  }
}
