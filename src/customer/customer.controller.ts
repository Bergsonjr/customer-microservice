import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { CustomerService } from './customer.service';
import { CreateCustomer } from './dto/create-customer.dto';
import { UpdateCustomer } from './dto/update-customer.dto';
import { Customer } from './interface/customer.interface';

@Controller('customer')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get('/:id')
  findCustomerById(@Param('id') id: string): Promise<Customer> {
    return this.customerService.find(id);
  }

  @Put('/:id')
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
