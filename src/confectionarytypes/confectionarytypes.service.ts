import { Injectable, Logger } from '@nestjs/common';
import { CreateConfectionaryTypeDto } from './dto/create-confectionarytype.dto';
import { UpdateConfectionarytypeDto } from './dto/update-confectionarytype.dto';
import { Prisma } from '@prisma/client';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListDto } from 'src/dto/list.dto';
import { ConfectionaryType } from './entities/confectionarytype.entity';

@Injectable()
export class ConfectionaryTypesService {
  private readonly logger = new Logger(ConfectionaryTypesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateConfectionaryTypeDto) {
    const id = uuidv7();
    return await this.prisma.confectionaryType.create({ data: { id, ...dto } });
  }

  async findAll(
    filters?: Prisma.ConfectionaryTypeWhereInput,
  ): Promise<ListDto<ConfectionaryType>> {
    return {
      items: await this.prisma.confectionaryType.findMany({ where: filters }),
      count: await this.prisma.confectionaryType.count({ where: filters }),
    };
  }

  findOne(id: string) {
    return this.prisma.confectionaryType.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdateConfectionarytypeDto) {
    return this.prisma.confectionaryType.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.confectionaryType.delete({ where: { id } });
  }
}
