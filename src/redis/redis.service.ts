import { BadGatewayException, Injectable } from '@nestjs/common';
import Redis, { Redis as RedisClient } from 'ioredis';

@Injectable()
export default class RedisService {
  private client: RedisClient;

  constructor() {
    this.client = new Redis(
      Number(process.env.REDIS_PORT),
      process.env.REDIS_HOST,
      {
        keyPrefix: process.env.REDIS_PREFIX,
      },
    );
  }

  async set(key: string, value: any): Promise<void> {
    try {
      await this.client.set(key, JSON.stringify(value));
    } catch (error) {
      throw new BadGatewayException('Redis is unavailable');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    try {
      const data = await this.client.get(key);

      if (!data) return null;

      const parsedData = JSON.parse(data) as T;

      return parsedData;
    } catch (error) {
      throw new BadGatewayException('Redis is unavailable');
    }
  }
}
