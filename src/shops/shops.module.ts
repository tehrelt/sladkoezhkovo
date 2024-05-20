import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  controllers: [ShopsController],
  providers: [ShopsService],
  exports: [ShopsService],
  imports: [PrismaModule, MinioModule],
})
export class ShopsModule {}
