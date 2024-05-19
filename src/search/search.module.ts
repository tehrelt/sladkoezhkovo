import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { UsersModule } from 'src/users/users.module';
import { FactoriesModule } from 'src/factories/factories.module';
import { ProductsModule } from 'src/products/products.module';

@Module({
  controllers: [SearchController],
  providers: [SearchService],
  imports: [UsersModule, FactoriesModule, ProductsModule],
})
export class SearchModule {}
