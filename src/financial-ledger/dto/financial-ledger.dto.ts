export class FinancialLedgerDto {
  id: number;
  expenditure: number;
  income: number;
  date: Date;
  remarks: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;

  constructor(
    id: number,
    expenditure: number,
    income: number,
    date: Date,
    remarks: string,
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date,
  ) {
    this.id = id;
    this.expenditure = expenditure;
    this.income = income;
    this.date = date;
    this.remarks = remarks;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.deletedAt = deletedAt;
  }
}
