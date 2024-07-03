import {
  IsDateString,
  IsInt,
  IsISO4217CurrencyCode,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import {
  IsNewPrefix,
  IsValidEndDate,
  IsValidStartDate,
} from './campaign.constrains';

export class CreateCampaignRequest {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  @IsValidStartDate()
  from: Date;

  @IsNotEmpty()
  @IsDateString()
  @IsValidEndDate()
  to: Date;

  @IsNotEmpty()
  @IsNumber()
  amount: number;

  @IsNotEmpty()
  @IsISO4217CurrencyCode()
  currency: string;

  @IsNotEmpty()
  @IsNewPrefix()
  prefix: string;
}

export class CampaignResponse {
  id: number;
  name: string;
  from: Date;
  to: Date;
  amount: number;
  currency: string;
  prefix: string;
}

export class CampaignQuery {
  @IsOptional()
  @IsString()
  prefix?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsDateString()
  from?: string;

  @IsOptional()
  @IsDateString()
  to?: string;

  @IsOptional()
  page: number = 1;

  @IsOptional()
  limit: number = 20;

  @IsOptional()
  @IsString()
  sortBy: string = 'to';

  @IsOptional()
  @IsString()
  sortOder: 'ASC' | 'DESC' = 'DESC';
}

export class VoucherGenerationRequest {
  @IsInt()
  amount: number;
}
