export interface Event {
  timestamp: Date;
  type: string;
}

export class CampaignCreated implements Event {
  timestamp: Date;
  name: string;
  from: Date;
  to: Date;
  amount: number;
  currency: string;
  prefix: string;
  type: 'CampaignCreated';

  constructor(
    name: string,
    from: Date,
    to: Date,
    amount: number,
    currency: string,
    prefix: string,
  ) {
    this.timestamp = new Date();
    this.name = name;
    this.from = from;
    this.to = to;
    this.amount = amount;
    this.currency = currency;
    this.prefix = prefix;
  }
}

export class CampaignDeleted implements Event {
  timestamp: Date;
  type = 'CampaignDeleted';

  constructor() {
    this.timestamp = new Date();
  }
}
