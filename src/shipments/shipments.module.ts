import { Module } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { ShipmentsController } from './shipments.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [ShipmentsController],
  providers: [ShipmentsService],
  exports: [ShipmentsService],
  imports: [PrismaModule, JwtModule, ProductsModule],
})
export class ShipmentsModule {}
