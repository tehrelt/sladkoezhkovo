import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { RedisClientType, createClient } from 'redis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  constructor() {
    const host = process.env.REDIS_HOST;
    const port = process.env.REDIS_PORT;

    this.client = createClient({
      url: `redis://@${host}:${port}/0`,
    });
  }

  async set(key: string, value: string) {
    return this.client.set(key, value);
  }

  async clear(key: string) {
    return this.client.del(key);
  }

  async get<T>(key: string): Promise<T> {
    console.log(`RedisService: get by ${key}`);
    const value = await this.client.get(key);
    console.log(`RedisService: get by ${key} -> ${value}`);
    return value as T;
  }

  async onModuleInit() {
    return await this.client.connect();
  }

  async onModuleDestroy() {
    return await this.client.quit();
  }
}
