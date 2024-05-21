import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UsersModule } from 'src/users/users.module';
import { FactoriesModule } from 'src/factories/factories.module';
import { ShopsModule } from 'src/shops/shops.module';
import { CartModule } from 'src/cart/cart.module';
import { ShipmentsModule } from 'src/shipments/shipments.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [
    UsersModule,
    FactoriesModule,
    ShopsModule,
    CartModule,
    ShipmentsModule,
  ],
})
export class AccountModule {}
