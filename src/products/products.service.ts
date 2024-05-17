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

  async findAll(filters?: Prisma.ProductWhereInput): Promise<ListDto<Product>> {
    const products = await this.prisma.product.findMany({
      where: filters,
      include: {
        confectionaryType: true,
        factory: true,
        image: true,
      },
    });

    const count = await this.prisma.product.count({
      where: filters,
    });

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
        };

        return d;
      }),
    );

    return {
      items: pp,
      count,
    };
  }

  findOne(id: string) {}

  update(id: string, dto: UpdateProductDto) {}

  remove(id: string) {}
}
