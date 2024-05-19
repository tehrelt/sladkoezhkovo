import { Injectable, Logger } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Prisma } from '@prisma/client';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListDto } from 'src/dto/list.dto';
import { Product } from './entities/product.entity';
import { MinioService } from 'src/minio/minio.service';
import { Bucket } from 'src/minio/minio.consts';
import { User } from 'src/users/entities/user.entity';
import { FiltersDto } from 'src/dto/filters.dto';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
  ) {}

  async create(dto: CreateProductDto, file?: Express.Multer.File) {
    const id = uuidv7();
    let image: { id: string; fileName: string } = undefined;

    if (file) {
      this.logger.verbose(`Uploading image ${file.mimetype}`);
      image = await this.minio.uploadFile(file, Bucket.PRODUCT);
    }

    this.logger.verbose(`Creating product ${dto.name}`, dto);

    return await this.prisma.product.create({
      data: {
        id,
        name: dto.name,
        confectionaryType: { connect: { id: dto.confectionaryTypeId } },
        factory: { connect: { id: dto.factoryId } },
        image: image
          ? { create: { id: image.id, name: image.fileName } }
          : undefined,
      },
    });
  }

  async findAll(
    filters?: FiltersDto & Prisma.ProductWhereInput,
  ): Promise<ListDto<Product>> {
    this.logger.verbose(`Finding all products`, filters);

    const { skip, take, ...where } = filters;

    const products = await this.prisma.product.findMany({
      where,
      skip,
      take,
      include: {
        confectionaryType: true,
        factory: true,
        image: true,
        catalogueEntries: true,
      },
    });

    const count = await this.prisma.product.count({ where });

    const pp: Product[] = await Promise.all(
      products.map(async (p) => {
        const d: Product = {
          id: p.id,
          name: p.name,
          confectionaryType: {
            id: p.confectionaryType.id,
            name: p.confectionaryType.name,
          },
          factory: {
            id: p.factory.id,
            name: p.factory.name,
            handle: p.factory.handle,
          },
          createdAt: p.createdAt,
          updatedAt: p.updatedAt,
          image: p.image
            ? await this.minio.getFileUrl(p.image.name, Bucket.PRODUCT)
            : undefined,
          catalogueEntries: p.catalogueEntries,
        };

        return d;
      }),
    );

    return {
      items: pp,
      count,
    };
  }

  async findOne(id: string): Promise<Product> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        image: true,
        factory: true,
        confectionaryType: true,
        catalogueEntries: { include: { package: true, unit: true } },
      },
    });

    const image = product.image
      ? await this.minio.getFileUrl(product.image.name, Bucket.PRODUCT)
      : undefined;

    return {
      confectionaryType: product.confectionaryType,
      factory: product.factory,
      id: product.id,
      name: product.name,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
      image,
      catalogueEntries: product.catalogueEntries.map((e) => ({
        id: e.id,
        price: e.price,
        quantity: e.quantity,
        unit: e.unit,
        package: e.package,
      })),
    };
  }

  async owner(id: string): Promise<{ handle: string }> {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        factory: {
          include: {
            user: true,
          },
        },
      },
    });

    const u = product.factory.user;

    return {
      handle: u.handle,
    };
  }

  update(id: string, dto: UpdateProductDto) {}

  remove(id: string) {}
}
