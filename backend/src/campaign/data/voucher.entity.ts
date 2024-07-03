import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { Campaign } from './campaign.entity';

@Index('voucher-code-index', ['code'])
@Index('voucher-campaign-id-index', ['campaignId'])
@Entity('vouchers')
export class Voucher {
  static createFromCampaign(campaign: Campaign, code: string): Voucher {
    const voucher = new Voucher();
    voucher.code = code;
    voucher.campaignId = campaign.id;
    return voucher;
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text', unique: true })
  code: string;

  @Column()
  campaignId: number;
}
