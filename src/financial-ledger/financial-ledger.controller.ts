import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiNoContentResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { User as CurrentUser } from '../auth/user.decorator';
import { User } from '../entities/User';
import { FinancialLedgerWriteDto } from './dto/financial-ledger.write.dto';
import { UpdateRequestDto } from './dto/update-request.dto';
import { FinancialLedgerService } from './financial-ledger.service';

@Controller('/financial-ledgers')
@ApiTags('FinancialLedger')
export class FinancialLedgerController {
  constructor(
    private readonly financialLedgerService: FinancialLedgerService,
  ) {}

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse()
  async update(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) financialLedgerId: number,
    @Body(new ValidationPipe({ transform: true })) body: UpdateRequestDto,
  ) {
    return this.financialLedgerService.update(user, financialLedgerId, body);
  }

  @Put('/:id/cancellation')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse()
  async delete(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) financialLedgerId: number,
  ) {
    return this.financialLedgerService.delete(user, financialLedgerId);
  }

  @Put('/:id/restoration')
  @HttpCode(HttpStatus.NO_CONTENT)
  @UseGuards(JwtAuthGuard)
  @ApiNoContentResponse()
  async restore(
    @CurrentUser() user: User,
    @Param('id', ParseIntPipe) financialLedgerId: number,
  ) {
    return this.financialLedgerService.restore(user, financialLedgerId);
  }

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
