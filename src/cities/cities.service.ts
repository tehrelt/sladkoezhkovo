import { Injectable, Logger } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListDto } from 'src/dto/list.dto';
import { City, Prisma } from '@prisma/client';
import { FiltersDto } from 'src/dto/filters.dto';

@Injectable()
export class CitiesService {
  private readonly logger = new Logger('CitiesService');

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCityDto) {
    const id = uuidv7();

    this.logger.verbose('creating a new city', { id, ...dto });

    return await this.prisma.city.create({
      data: {
        id: id,
        name: dto.name,
      },
    });
  }

  async findAll(
    f?: FiltersDto & Prisma.CityWhereInput,
  ): Promise<ListDto<City>> {
    const { skip, take, ...where } = f;

    this.logger.verbose('getting all cities', skip, take, where);

    const items = await this.prisma.city.findMany({
      where,
      skip,
      take,
    });

    this.logger.verbose('got all cities', items);

    return {
      items,
      count: await this.prisma.city.count({ where }),
    };
  }

  async findOne(id: string) {
    this.logger.verbose('getting a city', { id });

    return await this.prisma.city.findUnique({ where: { id } });
  }
}
