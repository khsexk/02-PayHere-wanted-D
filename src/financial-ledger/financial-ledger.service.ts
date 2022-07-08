import { Injectable, NotFoundException } from '@nestjs/common';
import { FinancialLedgerDayDto } from './dto/financial-ledger.day.dto';
import { FinancialLedgerWriteDto } from './dto/financial-ledger.write.dto';
import { FinancialLedgerGroupDto } from './dto/financial-ledger.group.dto';
import { FinancialLedgerListDto } from './dto/financial-ledger.list.dto';
import { FinancialLedgerResponseDto } from './dto/financial-ledger.response.dto';
import { FinancialLedgerDto } from './dto/financial-ledger.dto';
import { User } from 'src/entities/User';
import { FinancialLedgerRepository } from './financial-ledger.repository';

@Injectable()
export class FinancialLedgerService {
  constructor(private financialLedgerRepository: FinancialLedgerRepository) {}

  //가계부 작성
  async createMemo(
    financialLedgerWriteDto: FinancialLedgerWriteDto,
    user: User,
  ) {
    return await this.financialLedgerRepository.createMemo(
      financialLedgerWriteDto,
      user,
    );
  }

  //가계부 1개내역 상세보기
  async getOneMemo(id: number, userId: number): Promise<FinancialLedgerDto> {
    const data = await this.financialLedgerRepository.getOneMemo(id, userId);
    const result = new FinancialLedgerDto(
      data.id,
      data.expenditure,
      data.income,
      data.date,
      data.remarks,
      data.createdAt,
      data.updatedAt,
      data.deletedAt,
    );

    return result;
  }

  //가계부 전체 리스트 조회
  async getAllMemo(userId: number) {
    const { groupData, userData } =
      await this.financialLedgerRepository.getAllMemo(userId);

    const resultList = [];

    groupData.forEach((gData) => {
      const dayList: FinancialLedgerListDto[] = [];

      userData.forEach((uData) => {
        //작성일이 같은 경우 그룹화해주기
        if (gData.day_date === uData.day_date) {
          const data = new FinancialLedgerListDto(
            uData.id,
            uData.day_date,
            uData.expenditure,
            uData.income,
            uData.remarks,
          );

          dayList.push(data);
        }
      });

      //하루단위
      const dayData = new FinancialLedgerDayDto(gData.today_sum, dayList);
      //전체리스트-하루단위
      const finalData = new FinancialLedgerResponseDto(gData.day_date, dayData);

      resultList.push(finalData);
    });

    return resultList;
  }
}
