import { Injectable } from '@nestjs/common';
import { SearchQueryDto } from './dto/query.dto';
import { UsersService } from 'src/users/users.service';
import { FactoriesService } from 'src/factories/factories.service';
import { ProductsService } from 'src/products/products.service';
import {
  FactoryResult,
  ProductResult,
  SearchResults,
  UserResult,
} from './entities/search.entity';

@Injectable()
export class SearchService {
  constructor(
    private readonly userService: UsersService,
    private readonly factoryService: FactoriesService,
    private readonly productService: ProductsService,
  ) {}

  async search(dto: SearchQueryDto) {
    const users = await this.userService.findAll({
      OR: [
        {
          handle: { contains: dto.query, mode: 'insensitive' },
        },
        {
          lastName: { contains: dto.query, mode: 'insensitive' },
        },
      ],
    });

    const uu: UserResult[] = users.users.map((u) => ({
      handle: u.handle,
      lastName: u.lastName,
      firstName: u.firstName,
      middleName: u.middleName,
      image: u.image,
    }));

    const factories = await this.factoryService.findAll({
      OR: [
        { name: { contains: dto.query, mode: 'insensitive' } },
        { handle: { contains: dto.query, mode: 'insensitive' } },
      ],
    });

    const ff: FactoryResult[] = factories.items.map((f) => ({
      handle: f.handle,
      name: f.name,
      image: f.image,
    }));

    const products = await this.productService.findAll({
      OR: [{ name: { contains: dto.query, mode: 'insensitive' } }],
    });

    const pp: ProductResult[] = products.items.map((p) => ({
      id: p.id,
      name: p.name,
      image: p.image,
    }));

    const results: SearchResults = {
      factories: ff,
      users: uu,
      products: pp,
    };

    return results;
  }
}
