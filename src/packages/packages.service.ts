import { Injectable, Logger } from '@nestjs/common';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ListDto } from 'src/dto/list.dto';
import { Package } from './entities/package.entity';

@Injectable()
export class PackagesService {
  private readonly logger = new Logger(PackagesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreatePackageDto) {
    const id = uuidv7();
    return await this.prisma.package.create({ data: { ...dto, id } });
  }

  async findAll(filters?: Prisma.PackageWhereInput): Promise<ListDto<Package>> {
    return {
      items: await this.prisma.package.findMany({ where: filters }),
      count: await this.prisma.package.count({ where: filters }),
    };
  }

  findOne(id: string) {
    return this.prisma.package.findUnique({ where: { id } });
  }

  update(id: string, dto: UpdatePackageDto) {
    return this.prisma.package.update({ where: { id }, data: dto });
  }

  remove(id: string) {
    return this.prisma.package.delete({ where: { id } });
  }
}