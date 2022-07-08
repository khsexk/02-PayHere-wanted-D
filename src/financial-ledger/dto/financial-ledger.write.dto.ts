import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber } from 'class-validator';

//가계부 작성 DTO
export class FinancialLedgerWriteDto {
  @ApiProperty({ example: 1000, description: '지출' })
  @IsNumber()
  expenditure: number;

  @ApiProperty({ example: 10000, description: '수입' })
  @IsNumber()
  income: number;

  @ApiProperty({ example: '2022-07-07', description: '소비 날짜' })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  date: Date;

  @ApiProperty({ example: '가계부 메모', description: '내용' })
  remarks: string;
}
