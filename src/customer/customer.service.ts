import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { v4 as uuid } from 'uuid';
import { CreateCustomer } from './dto/create-customer.dto';
import { UpdateCustomer } from './dto/update-customer.dto';
import { Customer } from './interface/customer.interface';
import RedisService from '../redis/redis.service';

@Injectable()
export class CustomerService {
  constructor(private readonly redis: RedisService) {}
  async find(id: string): Promise<Customer> {
    const foundCustomer: Customer = await this.redis.get(id);

    if (!foundCustomer) throw new NotFoundException('Customer not found');

    return foundCustomer;
  }

  async create(customer: CreateCustomer): Promise<Customer> {
    const id: string = uuid();

    await this.redis.set(id, customer);

    return { ...customer, id };
  }

  async update(id: string, customer: UpdateCustomer): Promise<Customer> {
    const { id: idToUpdate, ...customerToUpdate } = customer;

    if (id !== idToUpdate) throw new ConflictException('Id conflict');

    const foundCustomer = await this.find(id);

    const updatedCustomer = { ...foundCustomer, ...customerToUpdate };

    await this.redis.set(id, updatedCustomer);

    return updatedCustomer;
  }
}
