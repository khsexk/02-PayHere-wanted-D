import { FinancialLedgerListDto } from './financial-ledger.list.dto';

//FinancialLedgerListDto -> FinancialLedgerDayDto -> FinancialLedgerResponseDto
//일자별 그룹화 리스트 DTO
export class FinancialLedgerDayDto {
  money: number;
  memolist: FinancialLedgerListDto[];

  constructor(money: number, memolist: FinancialLedgerListDto[]) {
    this.money = money;
    this.memolist = memolist;
  }
}
