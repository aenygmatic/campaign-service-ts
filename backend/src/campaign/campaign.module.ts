import { Module } from '@nestjs/common';
import { CampaignController } from './api/v1/campaign.controller';
import { CampaignService } from './campaign.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CampaignRepository } from './data/campaign.repository';
import { VoucherRepository } from './data/voucher.repository';
import { IsNewPrefixConstraint } from './api/v1/campaign.constrains';
import { Campaign } from './data/campaign.entity';
import { Voucher } from './data/voucher.entity';
import { CodeGenerator } from './code.generator';
import { VoucherService } from './voucher.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Campaign,
      Voucher,
      VoucherRepository,
      CampaignRepository,
    ]),
  ],
  controllers: [CampaignController],
  providers: [
    CampaignService,
    VoucherService,
    IsNewPrefixConstraint,
    CampaignRepository,
    CodeGenerator,
  ],
})
export class CampaignModule {}
