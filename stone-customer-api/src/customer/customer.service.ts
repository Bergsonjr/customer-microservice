import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { InjectRedis, Redis } from '@nestjs-modules/ioredis';
import { v4 as uuid } from 'uuid';
import { CreateCustomer } from './dto/create-customer.dto';
import { UpdateCustomer } from './dto/update-customer.dto';
import { Customer } from './dto/customer.dto';

@Injectable()
export class CustomerService {
  constructor(@InjectRedis() private readonly redis: Redis) {}
  async find(id: string): Promise<Customer> {
    try {
      const foundCustomer = await this.redis.get(id);
      console.log(foundCustomer, 'foundCustomer');
      if (!foundCustomer) throw new NotFoundException('Customer not found');

      return JSON.parse(foundCustomer);
    } catch (error) {
      console.log(error, 'error');
      throw error;
    }
  }

  async create(customer: CreateCustomer): Promise<Customer> {
    try {
      console.log(customer, 'customer');
      const id: string = uuid();
      const newCustomer = await this.redis.set(id, JSON.stringify(customer));
      console.log(newCustomer, 'newCustomer');
      return { ...customer, id };
    } catch (error) {}
  }

  async update(id: string, customer: UpdateCustomer): Promise<Customer> {
    if (id !== customer.id) throw new ConflictException('Id conflict');

    try {
      console.log(customer, 'customer');

      const updatedCustomer = await this.redis.set(id);

      return updatedCustomer;
    } catch (error) {}
  }
}
