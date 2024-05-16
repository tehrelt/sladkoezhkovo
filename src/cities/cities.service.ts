import { Injectable, Logger } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListDto } from 'src/dto/list.dto';
import { City } from '@prisma/client';

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

  async findAll(): Promise<ListDto<City>> {
    this.logger.verbose('getting all cities');

    return {
      items: await this.prisma.city.findMany(),
      count: await this.prisma.city.count(),
    };
  }

  async findOne(id: string) {
    this.logger.verbose('getting a city', { id });

    return await this.prisma.city.findUnique({ where: { id } });
  }
}
