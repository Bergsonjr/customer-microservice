import { Test, TestingModule } from '@nestjs/testing';
import RedisService from './redis.service';
import Redis from 'ioredis';
import { BadGatewayException } from '@nestjs/common';

describe('RedisService', () => {
  let service: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RedisService],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should get some data', async () => {
    const testData = { test: 'this is a test data' };

    jest
      .spyOn(Redis.prototype, 'get')
      .mockResolvedValue(JSON.stringify(testData));

    const data = await service.get('something');

    expect(data).toEqual(testData);
  });

  it('should not get some data because key dont exists', async () => {
    jest.spyOn(Redis.prototype, 'get').mockResolvedValue(null);

    const data = await service.get('something_null');

    expect(data).toEqual(null);
  });

  it('should not get some data because Redis is unavailable', async () => {
    jest
      .spyOn(Redis.prototype, 'get')
      .mockRejectedValue(new BadGatewayException('Redis is unavailable'));

    expect(service.get('something')).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });

  it('should set some data', async () => {
    const testData = { test: 'this is a test data to set' };

    jest.spyOn(Redis.prototype, 'set').mockResolvedValue({});

    expect(service.set('someKey', testData)).resolves.not.toThrowError();
  });

  it('should not set some data because Redis is unavailable', async () => {
    const testData = { test: 'this is a test data to set' };

    jest
      .spyOn(Redis.prototype, 'set')
      .mockRejectedValue(new BadGatewayException('Redis is unavailable'));

    expect(service.set('someKey', testData)).rejects.toBeInstanceOf(
      BadGatewayException,
    );
  });
});
