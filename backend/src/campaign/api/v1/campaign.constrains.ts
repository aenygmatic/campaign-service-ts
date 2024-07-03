import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { CampaignRepository } from '../../data/campaign.repository';
import * as moment from 'moment';

@ValidatorConstraint({ async: true })
export class IsNewPrefixConstraint implements ValidatorConstraintInterface {
  static campaigns: CampaignRepository;

  async validate(prefix: any, args: ValidationArguments) {
    const count = await IsNewPrefixConstraint.campaigns.count({
      where: { prefix },
    });
    return count == 0;
  }

  defaultMessage(args: ValidationArguments) {
    return `prefix ${args.value} already exists`;
  }
}

@ValidatorConstraint()
export class IsValidStartDateConstraint
  implements ValidatorConstraintInterface
{
  validate(value: any, args: ValidationArguments) {
    return moment(value).isAfter(moment());
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.value} must be a future date`;
  }
}

@ValidatorConstraint()
export class IsValidEmdDateConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const { from } = args.object as any;
    if (!from) {
      return true;
    }

    const startDate = moment(from);
    const endDate = moment(value);
    return endDate.isAfter(startDate);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.value} must be after the start date`;
  }
}

export function IsValidStartDate(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isValidStartDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidStartDateConstraint,
    });
  };
}

export function IsValidEndDate(validationOptions?: ValidationOptions) {
  return function (object, propertyName: string) {
    registerDecorator({
      name: 'isValidEndDate',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: IsValidEmdDateConstraint,
    });
  };
}

export function IsNewPrefix(validationOptions?: ValidationOptions) {
  return (object, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsNewPrefixConstraint,
    });
  };
}
