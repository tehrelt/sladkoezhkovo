import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { UsersModule } from 'src/users/users.module';
import { FactoriesModule } from 'src/factories/factories.module';

@Module({
  controllers: [AccountController],
  providers: [AccountService],
  imports: [UsersModule, FactoriesModule],
})
export class AccountModule {}
