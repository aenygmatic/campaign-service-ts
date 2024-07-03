import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { CampaignCreated, CampaignDeleted, Event } from './events';

export enum CampaignStatus {
  CREATED = 'CREATED',
  DELETED = 'DELETED',
}

@Index('campaign-status-index', ['status'])
@Index('campaign-from-index', ['from'])
@Index('campaign-to-index', ['to'])
@Index('campaign-prefix-index', ['prefix'])
@Entity('campaigns')
export class Campaign {
  static createFromEvent(created: CampaignCreated): Campaign {
    const campaign = new Campaign();
    campaign.history.push(created);
    campaign.name = created.name;
    campaign.to = created.to;
    campaign.from = created.from;
    campaign.amount = created.amount;
    campaign.currency = created.currency;
    campaign.prefix = created.prefix;
    return campaign;
  }

  private constructor() {
    this.history = [];
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: CampaignStatus,
    default: CampaignStatus.CREATED,
  })
  status: CampaignStatus;

  @Column({ type: 'varchar', length: 200 })
  name: string;

  @Column('timestamp with time zone')
  from: Date;

  @Column('timestamp with time zone')
  to: Date;

  @Column('double precision')
  amount: number;

  @Column({ type: 'varchar', length: 3 })
  currency: string;

  @Column({ type: 'varchar', length: 50, unique: true })
  prefix: string;

  @Column({ type: 'jsonb', nullable: true, default: null })
  history: (Event | CampaignCreated | CampaignDeleted)[];
}
