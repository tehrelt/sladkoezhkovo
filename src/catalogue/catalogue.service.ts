import { Injectable, Logger } from '@nestjs/common';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { Prisma } from '@prisma/client';
import { ListDto } from 'src/dto/list.dto';
import { CatalogueEntry } from './entities/catalogue.entity';
import { FiltersDto } from 'src/dto/filters.dto';

@Injectable()
export class CatalogueService {
  private readonly logger = new Logger(CatalogueService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCatalogueDto) {
    const id = uuidv7();

    const entry = await this.prisma.catalogueEntry.create({
      data: {
        id,
        price: dto.price,
        quantity: dto.quantity,
        product: { connect: { id: dto.productId } },
        package: { connect: { id: dto.packageId } },
        unit: { connect: { id: dto.unitId } },
      },
    });

    return entry;
  }

  async findAll(
    filters?: FiltersDto & Prisma.CatalogueEntryWhereInput,
  ): Promise<ListDto<CatalogueEntry>> {
    const { skip, take, ...where } = filters;

    const entries = await this.prisma.catalogueEntry.findMany({
      where,
      skip,
      take,
      include: {
        product: true,
        package: true,
        unit: true,
      },
    });

    const count = await this.prisma.catalogueEntry.count({ where });

    return {
      items: entries.map((e) => ({
        id: e.id,
        price: e.price,
        productId: e.product.id,
        package: e.package,
        unit: e.unit,
        quantity: e.quantity,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      })),
      count,
    };
  }

  findOne(id: string) {
    return `This action returns a #${id} catalogue`;
  }

  update(id: string, dto: UpdateCatalogueDto) {
    return `This action updates a #${id} catalogue`;
  }

  remove(id: string) {
    return `This action removes a #${id} catalogue`;
  }
}
