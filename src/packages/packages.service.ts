import { Injectable, Logger } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ListDto } from 'src/dto/list.dto';
import { Package } from './entities/package.entity';
import { FiltersDto } from 'src/dto/filters.dto';
import { DepsDto } from 'src/dto/deps.dto';

@Injectable()
export class PackagesService {
  private readonly logger = new Logger(PackagesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePackageDto) {
    const id = uuidv7();
    return await this.prisma.package.create({ data: { ...dto, id } });
  }

  async findAll(
    filters?: FiltersDto & Prisma.PackageWhereInput,
  ): Promise<ListDto<Package>> {
    const { skip, take, ...where } = filters;

    return {
      items: await this.prisma.package.findMany({
        where,
        skip,
        take,
        include: { unit: true },
      }),
      count: await this.prisma.package.count({ where }),
    };
  }

  findOne(id: string) {
    return this.prisma.package.findUnique({
      where: { id },
      include: { unit: true },
    });
  }

  update(id: string, dto: UpdatePackageDto) {
    return this.prisma.package.update({ where: { id }, data: dto });
  }

  async deps(id: string): Promise<DepsDto> {
    const r = await this.prisma.package.findFirst({
      where: { id },
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            CatalogueEntry: true,
          },
        },
      },
    });

    return {
      id: r.id,
      name: r.name,
      count: r._count.CatalogueEntry,
    };
  }

  remove(id: string) {
    return this.prisma.package.delete({ where: { id } });
  }
}
