import { Module } from '@nestjs/common';
import { FactoriesService } from './factories.service';
import { FactoriesController } from './factories.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';
import { JwtModule } from '@nestjs/jwt';
import { MinioModule } from 'src/minio/minio.module';

@Module({
  controllers: [FactoriesController],
  providers: [FactoriesService],
  exports: [FactoriesService],
  imports: [PrismaModule, ProductsModule, JwtModule, MinioModule],
})
export class FactoriesModule {}
