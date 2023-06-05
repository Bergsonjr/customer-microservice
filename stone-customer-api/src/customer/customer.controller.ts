import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomer } from './dto/create-customer.dto';
import { UpdateCustomer } from './dto/update-customer.dto';
import { Customer } from './dto/customer.dto';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/:id')
  findCustomerById(@Param('id') id: string): Promise<Customer> {
    console.log(id, 'id');
    return this.customerService.find(id);
  }

  @Patch('/:id')
  updateCustomer(
    @Param('id') id: string,
    @Body() customer: UpdateCustomer,
  ): Promise<Customer> {
    return this.customerService.update(id, customer);
  }

  @Post()
  createCustomer(@Body() customer: CreateCustomer): Promise<Customer> {
    return this.customerService.create(customer);
  }
}
