import { Injectable } from '@nestjs/common';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { District } from './entities/district.entity';
import { Prisma } from '@prisma/client';
import { ListDto } from 'src/dto/list.dto';

@Injectable()
export class DistrictsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateDistrictDto) {
    const id = uuidv7();

    return this.prisma.district.create({
      data: {
        id,
        name: dto.name,
        city: { connect: { id: dto.cityId } },
      },
    });
  }

  async findAll(
    filters?: Prisma.DistrictWhereInput,
  ): Promise<ListDto<District>> {
    return {
      items: (
        await this.prisma.district.findMany({
          include: { city: true },
          where: { ...filters },
        })
      ).map((d) => ({
        id: d.id,
        name: d.name,
        cityId: d.cityId,
        city: d.city.name,
        createdAt: d.createdAt,
        updatedAt: d.updatedAt,
      })),
      count: await this.prisma.district.count({ where: { ...filters } }),
    };
  }

  async findOne(id: string): Promise<District> {
    const d = await this.prisma.district.findUnique({
      where: { id },
      include: { city: true },
    });
    return {
      id: d.id,
      name: d.name,
      cityId: d.cityId,
      city: d.city.name,
      createdAt: d.createdAt,
      updatedAt: d.updatedAt,
    };
  }

  update(id: string, dto: UpdateDistrictDto) {
    return this.prisma.district.update({
      where: { id },
      data: {
        name: dto.name,
        city: { connect: { id: dto.cityId } },
      },
    });
  }

  remove(id: string) {
    this.prisma.district.delete({ where: { id } });
  }
}
