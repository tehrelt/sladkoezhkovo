import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ListDto } from 'src/dto/list.dto';
import { Factory } from './entities/factory.entity';
import { ProductsService } from 'src/products/products.service';
import { MinioService } from 'src/minio/minio.service';
import { Bucket } from 'src/minio/minio.consts';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import { FiltersDto } from 'src/dto/filters.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class FactoriesService {
  private readonly logger = new Logger(FactoriesService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
    private readonly minio: MinioService,
  ) {}

  async create(dto: CreateFactoryDto) {
    const id = uuidv7();
    // this.logger.verbose(`Creating a new factory`, { id, dto });
    const image = dto.file
      ? await this.minio.uploadFile(dto.file, Bucket.FACTORY)
      : undefined;

    try {
      const f = await this.prisma.factory.create({
        data: {
          id,
          handle: dto.handle,
          name: dto.name,
          phoneNumber: dto.phoneNumber,
          year: dto.year,
          user: { connect: { id: dto.ownerId } },
          city: { connect: { id: dto.cityId } },
          propertyType: { connect: { id: dto.propertyTypeId } },
          image: image
            ? { create: { id: image.id, name: image.fileName } }
            : null,
        },
      });
      return f;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        console.log('error', error);

        if (error.code === 'P2002') {
          throw new ConflictException('Фабрика уже существует');
        }

        throw new InternalServerErrorException(error.message);
      }
    }
  }

  async findAll(
    filters?: FiltersDto & Prisma.FactoryWhereInput,
  ): Promise<ListDto<Factory>> {
    const { skip, take, ...where } = filters;

    const items = await this.prisma.factory.findMany({
      where,
      skip,
      take,
      include: { city: true, user: true, image: true },
      orderBy: { createdAt: 'asc' },
    });

    const ff: Factory[] = await Promise.all(
      await items.map(async (f) => {
        const image = f.image
          ? await this.minio.getFileUrl(f.image.name, Bucket.FACTORY)
          : undefined;

        return {
          id: f.id,
          name: f.name,
          handle: f.handle,
          owner: f.user,
          city: f.city,
          phoneNumber: f.phoneNumber,
          year: f.year,
          createdAt: f.createdAt,
          updatedAt: f.updatedAt,
          image,
        };
      }),
    );

    return {
      items: ff,
      count: await this.prisma.factory.count({ where }),
    };
  }

  async findProducts(slug: string) {
    const pp = await this.productsService.findAll({
      factory: { handle: slug },
    });

    this.logger.verbose(`Getting products for factory`, { slug, pp });

    return pp;
  }

  async findOne(slug: string): Promise<Factory> {
    const f = await this.prisma.factory.findFirst({
      where: { OR: [{ id: slug }, { handle: slug }] },
      include: { city: true, user: true, image: true },
    });

    return {
      id: f.id,
      name: f.name,
      handle: f.handle,
      owner: f.user,
      city: f.city,
      phoneNumber: f.phoneNumber,
      year: f.year,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
      image: f.image
        ? await this.minio.getFileUrl(f.image.name, Bucket.FACTORY)
        : undefined,
    };
  }

  async update(id: string, dto: UpdateFactoryDto) {
    const image = dto.file
      ? await this.minio.uploadFile(dto.file, Bucket.FACTORY)
      : undefined;

    const f = await this.prisma.factory.update({
      where: { id },
      data: {
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        image: dto.file
          ? { create: { id: image.id, name: image.fileName } }
          : undefined,
        updatedAt: new Date(),
      },
    });

    return f;
  }
}
