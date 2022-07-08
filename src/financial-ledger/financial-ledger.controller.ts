import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { FinancialLedgerService } from './financial-ledger.service';
import { FinancialLedgerInterceptor } from './interceptor/financial-ledger.interceptor';
import { User as CurrentUser } from '../auth/user.decorator';
import { FinancialLedgerWriteDto } from './dto/financial-ledger.write.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { User } from 'src/entities/User';
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('FinancialLedger')
@UseInterceptors(FinancialLedgerInterceptor)
@Controller('financial-ledgers')
export class FinancialLedgerController {
  constructor(
    private readonly financialLedgerService: FinancialLedgerService,
  ) {}

  //가계부 작성
  @Post()
  @HttpCode(201)
  @ApiOperation({ summary: '가계부 내역 작성' })
  @ApiBody({ type: FinancialLedgerWriteDto })
  @UseGuards(JwtAuthGuard)
  async createMemo(
    @Body() financialLedgerWriteDto: FinancialLedgerWriteDto,
    @CurrentUser() user: User,
  ) {
    return await this.financialLedgerService.createMemo(
      financialLedgerWriteDto,
      user,
    );
  }

  //작성한 가계부 리스트 전부
  @Get()
  @HttpCode(200)
  @ApiOperation({ summary: '가계부 전체 리스트 조회' })
  @UseGuards(JwtAuthGuard)
  async getAllMemo(@CurrentUser() user: User) {
    const result = await this.financialLedgerService.getAllMemo(user.id);
    return result;
  }

  //가계부 1개의 내역 상세 확인
  @Get('/:id')
  @HttpCode(200)
  @ApiOperation({ summary: '가계부 내역 상세 확인' })
  @UseGuards(JwtAuthGuard)
  async getOneMemo(@Param('id') id: number, @CurrentUser() user: User) {
    const result = await this.financialLedgerService.getOneMemo(id, user.id);
    return result;
  }
}
