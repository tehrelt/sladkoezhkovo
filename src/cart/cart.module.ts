import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [],
  providers: [CartService],
  exports: [CartService],
  imports: [PrismaModule, ProductsModule],
})
export class CartModule {}
