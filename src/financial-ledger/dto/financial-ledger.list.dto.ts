//본인작성 가계부 내역 조회 DTO

export class FinancialLedgerListDto {
  id: number;
  day_date: string;
  expenditure: number;
  income: number;
  remarks: string;

  constructor(
    id: number,
    day_date: string,
    expenditure: number,
    income: number,
    remarks: string,
  ) {
    this.id = id;
    this.day_date = day_date;
    this.expenditure = expenditure;
    this.income = income;
    this.remarks = remarks;
  }
}
