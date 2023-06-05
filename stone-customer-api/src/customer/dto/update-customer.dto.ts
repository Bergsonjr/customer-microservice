import { PartialType } from '@nestjs/swagger';
import { Customer } from './customer.dto';

export class UpdateCustomer extends PartialType(Customer) {}
