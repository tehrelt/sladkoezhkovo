import { Injectable, Logger } from '@nestjs/common';
import { CreateCityDto } from './dto/create-city.dto';
import { UpdateCityDto } from './dto/update-city.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';

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

  async findAll() {
    this.logger.verbose('getting all cities');

    return await this.prisma.city.findMany();
  }

  async findOne(id: string) {
    this.logger.verbose('getting a city', { id });

    return await this.prisma.city.findUnique({ where: { id } });
  }
}
