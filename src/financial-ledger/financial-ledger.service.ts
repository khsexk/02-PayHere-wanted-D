import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { User } from '../entities/User';
import { UpdateRequestDto } from './dto/update-request.dto';
import { FinancialLedgerDayDto } from './dto/financial-ledger.day.dto';
import { FinancialLedgerWriteDto } from './dto/financial-ledger.write.dto';
import { FinancialLedgerListDto } from './dto/financial-ledger.list.dto';
import { FinancialLedgerResponseDto } from './dto/financial-ledger.response.dto';
import { FinancialLedgerDto } from './dto/financial-ledger.dto';
import { FinancialLedgerRepository } from './financial-ledger.repository';

@Injectable()
export class FinancialLedgerService {
  constructor(
    private readonly financialLedgerRepository: FinancialLedgerRepository,
  ) {}

  /**
   * 가계부 내역의 존재 여부 및 삭제 여부를 판단한 이후 수입(income), 지출(expenditure), 메모(remarks) 정보 수정
   *
   * @param user 요청한 유저정보
   * @param financialLedgerId 수정할 가계부 내역 아이디
   * @param updateInfo 수정될 정보(income, expenditure, remarks)
   */
  async update(
    user: User,
    financialLedgerId: number,
    updateInfo: UpdateRequestDto,
  ) {
    const financialLedger = await this.financialLedgerRepository.findOneBy({
      user: { id: user.id },
      id: financialLedgerId,
    });

    if (!financialLedger) {
      throw new NotFoundException('해당하는 가계부 내역이 존재하지 않습니다');
    }

    if (financialLedger.isDeleted()) {
      throw new BadRequestException('삭제된 가계부 내역입니다');
    }

    financialLedger.update(updateInfo);

    await this.financialLedgerRepository.save(financialLedger);
  }

  /**
   * 삭제를 원하는 가계부 내역의 존재 여무 및 삭제 여부를 확인 한 후, soft delete를 수행합니다
   *
   * @param user 요청한 유저
   * @param financialLedgerId 삭제할 가계부 내역 아이디
   */
  async delete(user: User, financialLedgerId: number) {
    const financialLedger = await this.financialLedgerRepository.findOneBy({
      user: { id: user.id },
      id: financialLedgerId,
    });

    if (!financialLedger) {
      throw new NotFoundException('해당하는 가계부 내역이 존재하지 않습니다');
    }

    if (financialLedger.isDeleted()) {
      throw new BadRequestException('이미 삭제된 가계부 내역 입니다');
    }

    financialLedger.delete();

    await this.financialLedgerRepository.save(financialLedger);
  }

  /**
   * 복구하기 원하는 가계부 내역의 존재 및 삭제 여부를 확인 한 후, 삭제되었다면 복구합니다.
   *
   * @param user 요청한 유저
   * @param financialLedgerId 복구할 가계부 아이디
   */
  async restore(user: User, financialLedgerId: number) {
    const financialLedger = await this.financialLedgerRepository.findOneBy({
      user: { id: user.id },
      id: financialLedgerId,
    });

    if (!financialLedger) {
      throw new NotFoundException('해당하는 가계부 내역이 존재하지 않습니다');
    }

    if (!financialLedger.isDeleted()) {
      throw new BadRequestException('삭제되지 않은 가계부 내역 입니다');
    }

    financialLedger.restore();

    await this.financialLedgerRepository.save(financialLedger);
  }

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
