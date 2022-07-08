import { FinancialLedgerDayDto } from './financial-ledger.day.dto';

//FinancialLedgerListDto -> FinancialLedgerDayDto -> FinancialLedgerResponseDto
//유저 전달 DTO
export class FinancialLedgerResponseDto {
  date: string;
  list: FinancialLedgerDayDto;

  constructor(date: string, list: FinancialLedgerDayDto) {
    this.date = date;
    this.list = list;
  }
}
