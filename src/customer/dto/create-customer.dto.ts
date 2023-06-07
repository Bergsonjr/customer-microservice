import { OmitType } from '@nestjs/swagger';
import { Customer } from './customer.dto';

export class CreateCustomer extends OmitType(Customer, ['id'] as const) {}
