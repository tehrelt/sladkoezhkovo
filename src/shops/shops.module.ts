import { Module } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ShopsController } from './shops.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MinioModule } from 'src/minio/minio.module';
import { ShipmentsModule } from 'src/shipments/shipments.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  controllers: [ShopsController],
  providers: [ShopsService],
  exports: [ShopsService],
  imports: [PrismaModule, JwtModule, MinioModule, ShipmentsModule],
})
export class ShopsModule {}
