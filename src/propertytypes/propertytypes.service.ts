import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CreatePropertyTypeDto } from './dto/create-propertytype.dto';
import { UpdatePropertyTypeDto } from './dto/update-propertytype.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { PropertyType } from './entities/propertytype.entity';
import { ListDto } from 'src/dto/list.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PropertyTypesService {
  private readonly logger = new Logger('PropertyTypesService');

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePropertyTypeDto) {
    const id = uuidv7();
    return await this.prisma.propertyType.create({ data: { id, ...dto } });
  }

  async findAll(
    filters?: Prisma.PropertyTypeWhereInput,
  ): Promise<ListDto<PropertyType>> {
    return {
      items: await this.prisma.propertyType.findMany({
        where: { ...filters },
        orderBy: { createdAt: 'asc' },
      }),
      count: await this.prisma.propertyType.count({
        where: { ...filters },
      }),
    };
  }

  async findOne(id: string): Promise<PropertyType> {
    const t = await this.prisma.propertyType.findUnique({ where: { id } });
    if (!t) {
      this.logger.warn(`No propertytype found for id ${id}`);
      throw new NotFoundException();
    }
    return t;
  }

  async update(id: string, dto: UpdatePropertyTypeDto) {
    return await this.prisma.propertyType.update({
      where: { id },
      data: { ...dto },
    });
  }

  async remove(id: string) {
    return await this.prisma.propertyType.delete({ where: { id } });
  }
}
