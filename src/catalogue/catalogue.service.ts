import { Injectable, Logger } from '@nestjs/common';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { Prisma } from '@prisma/client';
import { ListDto } from 'src/dto/list.dto';
import { CatalogueEntry } from './entities/catalogue.entity';
import { FiltersDto } from 'src/dto/filters.dto';
import { ProductsService } from 'src/products/products.service';

@Injectable()
export class CatalogueService {
  private readonly logger = new Logger(CatalogueService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductsService,
  ) {}

  async create(dto: CreateCatalogueDto) {
    const id = uuidv7();

    const entry = await this.prisma.catalogueEntry.create({
      data: {
        id,
        price: dto.price,
        unitUsage: dto.unitUsage,
        product: { connect: { id: dto.productId } },
        package: { connect: { id: dto.packageId } },
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
        product: {
          include: {
            factory: { select: { handle: true, name: true } },
            confectionaryType: { select: { name: true } },
          },
        },
        package: {
          include: {
            unit: true,
          },
        },
      },
    });

    const count = await this.prisma.catalogueEntry.count({ where });

    return {
      items: await Promise.all(
        entries.map(async (e) => ({
          id: e.id,
          price: e.price,
          unitUsage: e.unitUsage,
          package: e.package,
          createdAt: e.createdAt,
          updatedAt: e.updatedAt,
          factory: {
            name: e.product.factory.name,
            handle: e.product.factory.handle,
          },
          product: {
            id: e.productId,
            name: e.product.name,
            confectionaryType: e.product.confectionaryType.name,
            image: await this.productService.getProductImage(e.productId),
          },
        })),
      ),
      count,
    };
  }

  async findOne(id: string): Promise<CatalogueEntry> {
    const entry = await this.prisma.catalogueEntry.findFirst({
      where: { id },
      include: {
        product: {
          include: {
            factory: { select: { handle: true, name: true } },
            confectionaryType: { select: { name: true } },
          },
        },
        package: {
          include: {
            unit: true,
          },
        },
      },
    });

    return {
      id: entry.id,
      price: entry.price,
      package: entry.package,
      unitUsage: entry.unitUsage,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
      factory: {
        name: entry.product.factory.name,
        handle: entry.product.factory.handle,
      },
      product: {
        id: entry.productId,
        name: entry.product.name,
        confectionaryType: entry.product.confectionaryType.name,
        image: await this.productService.getProductImage(entry.productId),
      },
    };
  }

  update(id: string, dto: UpdateCatalogueDto) {
    return `This action updates a #${id} catalogue`;
  }

  remove(id: string) {
    return `This action removes a #${id} catalogue`;
  }
}
