import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CampaignService } from '../../campaign.service';
import {
  CampaignQuery,
  CreateCampaignRequest,
  VoucherGenerationRequest,
} from './campaign.models';
import { Response } from 'express';
import { VoucherService } from '../../voucher.service';

@Controller('/api/campaigns')
export class CampaignController {
  constructor(
    private readonly campaignService: CampaignService,
    private readonly voucherService: VoucherService,
  ) {}

  @Post('/')
  async create(
    @Body() request: CreateCampaignRequest,
    @Res() response: Response,
  ) {
    const campaign = await this.campaignService.create(
      request.name,
      request.from,
      request.to,
      request.amount,
      request.currency,
      request.prefix,
    );

    response
      .status(HttpStatus.CREATED)
      .location(`/campaigns/${campaign.id}`)
      .send(campaign);
  }

  @Get(':id')
  async get(@Param('id') id: number) {
    return this.campaignService.getById(Number(id));
  }

  @Get('/')
  async getCampaign(@Query() query: CampaignQuery) {
    return this.campaignService.get(
      query.limit,
      query.page,
      query.prefix,
      query.from,
      query.to,
      query.name,
      query.sortBy,
      query.sortOder,
    );
  }

  @Delete(':id')
  async delete(@Param('id') id: number) {
    return this.campaignService.delete(Number(id));
  }

  @Post(':id/vouchers')
  async generateVouchers(
    @Param('id') id: number,
    @Body() request: VoucherGenerationRequest,
  ) {
    const campaign = await this.campaignService.getById(id);
    return this.voucherService.createVoucher(campaign, request.amount);
  }

  @Get(':id/vouchers/download')
  async downloadVouchers(@Param('id') id: number, @Res() res: Response) {
    const csvData = await this.voucherService.findForCampaignAsCsv(id);
    const campaign = await this.campaignService.getById(id);

    res.header('Content-Type', 'text/csv');
    res.attachment(`vouchers-${campaign.prefix}`);
    res.send(csvData);
  }
}
