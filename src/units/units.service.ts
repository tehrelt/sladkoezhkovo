import { Injectable, Logger } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ListDto } from 'src/dto/list.dto';
import { Unit } from './entities/unit.entity';
import { FiltersDto } from 'src/dto/filters.dto';
import { DepsDto } from 'src/dto/deps.dto';

@Injectable()
export class UnitsService {
  private readonly logger = new Logger(UnitsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUnitDto) {
    const id = uuidv7();
    return await this.prisma.unit.create({ data: { id, ...dto } });
  }

  async findAll(
    filters?: FiltersDto & Prisma.UnitWhereInput,
  ): Promise<ListDto<Unit>> {
    const { skip, take, ...where } = filters;

    return {
      items: await this.prisma.unit.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      count: await this.prisma.unit.count({ where }),
    };
  }

  findOne(id: string) {
    return this.prisma.unit.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateUnitDto) {
    return this.prisma.unit.update({ where: { id }, data: dto });
  }

  async deps(id: string): Promise<DepsDto> {
    const r = await this.prisma.unit.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            Package: true,
          },
        },
      },
    });

    return {
      id: r.id,
      name: r.name,
      count: r._count.Package,
    };
  }

  remove(id: string) {
    return this.prisma.unit.delete({ where: { id } });
  }
}
