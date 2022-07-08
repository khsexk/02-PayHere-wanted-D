import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, Min } from 'class-validator';

export class UpdateRequestDto {
  @ApiProperty({ example: 1000 })
  @IsNumber()
  @Min(0)
  income: number;

  @ApiProperty({ example: 0 })
  @IsNumber()
  @Min(0)
  expenditure: number;

  @ApiProperty({ example: '업데이트 메모' })
  @IsString()
  remarks: string;
}
