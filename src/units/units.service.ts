import { Injectable, Logger } from '@nestjs/common';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ListDto } from 'src/dto/list.dto';
import { Unit } from './entities/unit.entity';

@Injectable()
export class UnitsService {
  private readonly logger = new Logger(UnitsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateUnitDto) {
    const id = uuidv7();
    return await this.prisma.unit.create({ data: { id, ...dto } });
  }

  async findAll(filters?: Prisma.UnitWhereInput): Promise<ListDto<Unit>> {
    return {
      items: await this.prisma.unit.findMany({
        where: filters,
        orderBy: { name: 'asc' },
      }),
      count: await this.prisma.unit.count({ where: filters }),
    };
  }

  findOne(id: string) {
    return this.prisma.unit.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateUnitDto) {
    return this.prisma.unit.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.unit.delete({ where: { id } });
  }
}
