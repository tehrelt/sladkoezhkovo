import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [PrismaModule, ConfigModule.forRoot({ envFilePath: '.env' }), RedisModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
