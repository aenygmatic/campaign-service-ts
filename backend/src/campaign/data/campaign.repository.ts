import { EntityRepository, Repository } from 'typeorm';
import { Campaign } from './campaign.entity';

@EntityRepository(Campaign)
export class CampaignRepository extends Repository<Campaign> {}
