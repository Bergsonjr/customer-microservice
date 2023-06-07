import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';
import { Customer } from './interface/customer.interface';
import RedisService from '../redis/redis.service';
import {
  BadGatewayException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { v4 } from 'uuid';

describe('CustomerController', () => {
  let service: CustomerService;
  let controller: CustomerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        CustomerService,
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  describe('findCustomerById', () => {
    it('should find by id an existent customer', async () => {
      const customerToFind: Customer = {
        id: 'd935016c-2723-436c-889c-5e2972963a0d',
        name: 'Bergson Jr.',
        document: 12345678,
      };

      jest.spyOn(service, 'find').mockResolvedValue(customerToFind);

      const customer = await controller.findCustomerById(
        'd935016c-2723-436c-889c-5e2972963a0d',
      );

      expect(customer).toEqual(customerToFind);
    });

    it('should not found by id an unexistent customer', async () => {
      jest
        .spyOn(service, 'find')
        .mockRejectedValue(new NotFoundException('Customer not found'));

      const customer = controller.findCustomerById(
        'z935016c-2723-436c-889c-5e2972963a0z',
      );

      expect(customer).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should not found by id an existent customer because REDIS is unavailable', async () => {
      jest
        .spyOn(service, 'find')
        .mockRejectedValue(new BadGatewayException('Redis is unavailable'));

      const customer = controller.findCustomerById(
        'd935016c-2723-436c-889c-5e2972963a0d',
      );

      expect(customer).rejects.toBeInstanceOf(BadGatewayException);
    });

    it('should not found by id an existent customer because SSO is unavailable', async () => {
      jest
        .spyOn(service, 'find')
        .mockRejectedValue(new BadGatewayException('SSO is unavailable'));

      const customer = controller.findCustomerById(
        'd935016c-2723-436c-889c-5e2972963a0d',
      );

      expect(customer).rejects.toBeInstanceOf(BadGatewayException);
    });
  });

  describe('updateCustomer', () => {
    it('should update an existent customer', async () => {
      const customer: Customer = {
        document: 111111111,
        id: 'd935016c-2723-436c-889c-5e2972963a0d',
        name: 'Bergson',
      };

      jest.spyOn(service, 'update').mockResolvedValue(customer);

      const updatedCustomer = await controller.updateCustomer(
        'd935016c-2723-436c-889c-5e2972963a0d',
        customer,
      );

      expect(customer).toEqual(updatedCustomer);
    });

    it('should not update an customer because not exists', async () => {
      const customer: Customer = {
        document: 111111111,
        id: 'z935016c-2723-436c-889c-5e2972963a0z',
        name: 'Bergson',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new NotFoundException('Customer not found'));

      const updateCustomer = controller.updateCustomer(
        'z935016c-2723-436c-889c-5e2972963a0z',
        customer,
      );

      expect(updateCustomer).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should not update an customer because conflict id', async () => {
      const customer: Customer = {
        document: 111111111,
        id: 'd935016c-2723-436c-889c-5e2972963a0d',
        name: 'Bergson',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new ConflictException('Conflict Id'));

      const updateCustomer = controller.updateCustomer(
        'z935016c-2723-436c-889c-5e2972963a0z',
        customer,
      );

      expect(updateCustomer).rejects.toBeInstanceOf(ConflictException);
    });

    it('should not update a customer because REDIS is unavailable', async () => {
      const customer: Customer = {
        document: 111111111,
        id: 'd935016c-2723-436c-889c-5e2972963a0d',
        name: 'Bergson',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new BadGatewayException('Redis is unavailable'));

      const updateCustomer = controller.updateCustomer(
        'd935016c-2723-436c-889c-5e2972963a0d',
        customer,
      );

      expect(updateCustomer).rejects.toBeInstanceOf(BadGatewayException);
    });

    it('should not update a customer because SSO is unavailable', async () => {
      const customer: Customer = {
        document: 111111111,
        id: 'd935016c-2723-436c-889c-5e2972963a0d',
        name: 'Bergson',
      };

      jest
        .spyOn(service, 'update')
        .mockRejectedValue(new BadGatewayException('SSO is unavailable'));

      const updateCustomer = controller.updateCustomer(
        'd935016c-2723-436c-889c-5e2972963a0d',
        customer,
      );

      expect(updateCustomer).rejects.toBeInstanceOf(BadGatewayException);
    });
  });

  describe('createCustomer', () => {
    it('should create a customer', async () => {
      const customer = {
        document: 111111111,
        name: 'Bergson',
      };

      jest
        .spyOn(service, 'create')
        .mockResolvedValue({ ...customer, id: v4() });

      const createdCustomer = await controller.createCustomer(customer);

      expect(createdCustomer.id).toBeDefined();
      expect(createdCustomer.name).toBe(customer.name);
      expect(createdCustomer.document).toBe(customer.document);
    });

    it('should not create a customer because REDIS is unavailable', async () => {
      const customer = {
        document: 111111111,
        name: 'Bergson',
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadGatewayException('Redis is unavailable'));

      const createCustomer = controller.createCustomer(customer);

      expect(createCustomer).rejects.toBeInstanceOf(BadGatewayException);
    });

    it('should not create a customer because SSO is unavailable', async () => {
      const customer = {
        document: 111111111,
        name: 'Bergson',
      };

      jest
        .spyOn(service, 'create')
        .mockRejectedValue(new BadGatewayException('SSO is unavailable'));

      const createCustomer = controller.createCustomer(customer);

      expect(createCustomer).rejects.toBeInstanceOf(BadGatewayException);
    });
  });
});
