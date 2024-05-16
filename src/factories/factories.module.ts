import { Module } from '@nestjs/common';
import { FactoriesService } from './factories.service';
import { FactoriesController } from './factories.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [FactoriesController],
  providers: [FactoriesService],
  exports: [FactoriesService],
  imports: [PrismaModule],
})
export class FactoriesModule {}
