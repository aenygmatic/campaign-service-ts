import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Campaign, CampaignStatus } from './data/campaign.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CampaignRepository } from './data/campaign.repository';
import { CampaignCreated, CampaignDeleted } from './data/events';
import { Voucher } from './data/voucher.entity';
import { VoucherRepository } from './data/voucher.repository';
import {
  IPaginationMeta,
  IPaginationOptions,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly repository: CampaignRepository,
    @InjectRepository(Voucher)
    private readonly voucherRepo: VoucherRepository,
  ) {}

  async create(
    name: string,
    from: Date,
    to: Date,
    amount: number,
    currency: string,
    prefix: string,
  ): Promise<Campaign> {
    const event = new CampaignCreated(name, from, to, amount, currency, prefix);
    const campaign = Campaign.createFromEvent(event);

    return await this.repository.save(campaign);
  }

  async getById(id: number): Promise<Campaign> {
    const campaign = await this.repository.findOneBy({ id });
    if (!campaign) {
      throw new NotFoundException(`Campaign with id ${id} not found`);
    }
    return campaign;
  }

  async get(
    limit: number,
    page: number,
    prefix?: string,
    from?: string,
    to?: string,
    name?: string,
    sortBy?: string,
    order?: 'ASC' | 'DESC',
  ) {
    const queryBuilder = this.repository.createQueryBuilder('campaigns');

    if (prefix) {
      queryBuilder.andWhere('campaigns.prefix = :prefix', { prefix });
    }
    if (name) {
      queryBuilder.andWhere('campaigns.name LIKE :name', { name: `%${name}%` });
    }
    if (from) {
      queryBuilder.andWhere('campaigns.to >= :from', { from });
    }
    if (to) {
      queryBuilder.andWhere('campaigns.from <= :to', { to });
    }

    queryBuilder.andWhere('campaigns.status = :status', {
      status: CampaignStatus.CREATED,
    });
    queryBuilder.orderBy('campaigns.' + sortBy, order);

    return paginate<Campaign>(
      queryBuilder,
      new (class implements IPaginationOptions<IPaginationMeta> {
        limit = limit;

        page = page;
      })(),
    );
  }

  async delete(id: number) {
    const campaign = await this.getById(id);
    if (campaign.from <= new Date()) {
      throw new HttpException(
        'Cannot delete a campaign that has already started',
        HttpStatus.BAD_REQUEST,
      );
    }

    campaign.status = CampaignStatus.DELETED;
    campaign.history.push(new CampaignDeleted());
    await this.voucherRepo.delete({ campaignId: campaign.id });
    return this.repository.save(campaign);
  }
}
