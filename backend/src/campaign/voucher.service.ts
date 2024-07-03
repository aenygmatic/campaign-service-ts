import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VoucherRepository } from './data/voucher.repository';
import { Voucher } from './data/voucher.entity';
import { Campaign, CampaignStatus } from './data/campaign.entity';
import { CodeGenerator } from './code.generator';
import { createObjectCsvStringifier } from 'csv-writer';

@Injectable()
export class VoucherService {
  constructor(
    @InjectRepository(Voucher)
    private repository: VoucherRepository,
    private generator: CodeGenerator,
  ) {}

  async createVoucher(campaign: Campaign, count: number): Promise<Voucher[]> {
    if (campaign.status == CampaignStatus.DELETED) {
      throw new HttpException(
        'Campaign is already in deleted state',
        HttpStatus.BAD_REQUEST,
      );
    }
    const vouchers = await this.generateUniqueVouchers(campaign, count);

    const chunks = this.chunk(vouchers, 10000);
    const savePromises = chunks.map((chunk) => this.repository.save(chunk));
    const savedItems = await Promise.all(savePromises);
    return [].concat(...savedItems);
  }

  private async generateUniqueVouchers(campaign: Campaign, count: number) {
    const campaignId = campaign.id;
    const voucherCodes = await this.repository
      .createQueryBuilder('voucher')
      .select('voucher.code', 'code')
      .where('voucher.campaignId = :campaignId', { campaignId })
      .getRawMany();

    const existingCodes = new Set(voucherCodes.map((voucher) => voucher.code));
    const vouchers = [];

    for (let i = 0; i < count; i++) {
      let code: string;
      do {
        const rawCode = this.generator.generate();
        code = campaign.prefix + '-' + rawCode;
      } while (existingCodes.has(code));

      existingCodes.add(code);
      vouchers.push(Voucher.createFromCampaign(campaign, code));
    }
    return vouchers;
  }

  chunk(arr: Voucher[], size) {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  }

  async findForCampaign(campaignId: number): Promise<Voucher[]> {
    return this.repository.findBy({ campaignId: campaignId });
  }

  async findForCampaignAsCsv(campaignId: number): Promise<string> {
    const vouchers = await this.findForCampaign(campaignId);

    const csvStringifier = createObjectCsvStringifier({
      header: [
        { id: 'id', title: 'id' },
        { id: 'code', title: 'code' },
        { id: 'campaignId', title: 'campaign_id' },
      ],
    });

    return (
      csvStringifier.getHeaderString() +
      csvStringifier.stringifyRecords(vouchers)
    );
  }
}
