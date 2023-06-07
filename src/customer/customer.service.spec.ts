import { Test, TestingModule } from '@nestjs/testing';
import { CustomerService } from './customer.service';
import RedisService from '../redis/redis.service';
import { Customer } from './interface/customer.interface';
import {
  BadGatewayException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { v4 } from 'uuid';

describe('CustomerService', () => {
  let redis: RedisService;
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<CustomerService>(CustomerService);
    redis = module.get<RedisService>(RedisService);
  });

  describe('find', () => {
    it('should find by id an existent customer', async () => {
      const customerToFind: Customer = {
        id: 'd935016c-2723-436c-889c-5e2972963a0d',
        name: 'Bergson Jr.',
        document: 12345678,
      };

      jest.spyOn(redis, 'get').mockResolvedValue(customerToFind);

      const customer = await service.find(
        'd935016c-2723-436c-889c-5e2972963a0d',
      );

      expect(customer).toEqual(customerToFind);
    });

    it('should not found by id an unexistent customer', async () => {
      jest.spyOn(redis, 'get').mockResolvedValue(null);

      const customer = service.find('z935016c-2723-436c-889c-5e2972963a0z');

      expect(customer).rejects.toBeInstanceOf(NotFoundException);
    });

    it('should not found by id an existent customer because REDIS is unavailable', async () => {
      jest
        .spyOn(redis, 'get')
        .mockRejectedValue(new BadGatewayException('Redis is unavailable'));

      const customer = service.find('d935016c-2723-436c-889c-5e2972963a0d');

      expect(customer).rejects.toBeInstanceOf(BadGatewayException);
    });
  });

  describe('update', () => {
    it('should update an existent customer', async () => {
      const customer: Customer = {
        document: 111111111,
        id: 'd935016c-2723-436c-889c-5e2972963a0d',
        name: 'Bergson',
      };

      jest.spyOn(service, 'update').mockResolvedValue(customer);
      jest.spyOn(redis, 'get').mockResolvedValue(customer);
      jest.spyOn(redis, 'set').mockResolvedValue();

      const updatedCustomer = await service.update(
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

      jest.spyOn(redis, 'get').mockResolvedValue(null);

      const updateCustomer = service.update(
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

      const updateCustomer = service.update(
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

      jest.spyOn(redis, 'get').mockResolvedValue(customer);
      jest
        .spyOn(redis, 'set')
        .mockRejectedValue(new BadGatewayException('Redis is unavailable'));

      const updateCustomer = service.update(
        'd935016c-2723-436c-889c-5e2972963a0d',
        customer,
      );

      expect(updateCustomer).rejects.toBeInstanceOf(BadGatewayException);
    });
  });

  describe('create', () => {
    it('should create a customer', async () => {
      const customer = {
        document: 111111111,
        name: 'Bergson',
      };

      jest
        .spyOn(service, 'create')
        .mockResolvedValue({ ...customer, id: v4() });

      jest.spyOn(redis, 'set').mockResolvedValue();

      const createdCustomer = await service.create(customer);

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
        .spyOn(redis, 'set')
        .mockRejectedValue(new BadGatewayException('Redis is unavailable'));

      const createCustomer = service.create(customer);

      expect(createCustomer).rejects.toBeInstanceOf(BadGatewayException);
    });
  });
});
