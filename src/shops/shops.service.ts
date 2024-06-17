import {
  ConflictException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { MinioService } from 'src/minio/minio.service';
import { Bucket } from 'src/minio/minio.consts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import e from 'express';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { Shop } from './entities/shop.entity';

@Injectable()
export class ShopsService {
  private readonly logger = new Logger(ShopsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
    private readonly shipmentsService: ShipmentsService,
  ) {}

  async create(dto: CreateShopDto) {
    const id = uuidv7();
    const image = dto.file
      ? await this.minio.uploadFile(dto.file, Bucket.SHOP)
      : undefined;

    try {
      const f = await this.prisma.shop.create({
        data: {
          id,
          handle: dto.handle,
          name: dto.name,
          phoneNumber: dto.phoneNumber,
          employeesCount: dto.employeesCount,
          openSince: dto.openSince,
          owner: { connect: { id: dto.ownerId } },
          district: { connect: { id: dto.districtId } },
          image: image
            ? { create: { id: image.id, name: image.fileName } }
            : undefined,
        },
      });

      this.logger.log('shop created', f);

      return f;
    } catch (error) {
      this.logger.error('shop create error', error);
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Магазин уже существует');
        }
      }
      throw new InternalServerErrorException(error.message);
    }
  }

  async find(slug: string): Promise<Shop> {
    const s = await this.prisma.shop.findFirst({
      where: { OR: [{ id: slug }, { handle: slug }] },
      include: {
        owner: {
          select: { handle: true },
        },
        district: {
          select: {
            name: true,
            city: {
              select: {
                name: true,
              },
            },
          },
        },
      },
    });

    const image = await this.getImage(s.id);

    return {
      id: s.id,
      handle: s.handle,
      name: s.name,
      owner: s.owner.handle,
      address: {
        city: s.district.city.name,
        district: s.district.name,
      },
      employeeCount: s.employeesCount,
      phoneNumber: s.phoneNumber,
      openSince: s.openSince,
      image: image,
    };
  }

  async getImage(id: string): Promise<string | undefined> {
    const fileName = await this.prisma.shop.findFirst({
      where: { id },
      select: { image: { select: { name: true } } },
    });

    const image = fileName
      ? await this.minio.getFileUrl(fileName.image.name, Bucket.SHOP)
      : undefined;

    return image;
  }

  async checkOwner(id: string, userId: string) {
    const shop = await this.prisma.shop.findFirst({
      where: { OR: [{ id }, { handle: id }] },
      include: { owner: true },
    });

    if (!shop) {
      throw new NotFoundException('Магазин не найден');
    }

    if (shop.owner.id !== userId) {
      throw new ForbiddenException('Вы не являетесь владельцем магазина');
    }

    return true;
  }

  async getOverall(
    id: string,
    userId: string,
    range: { startDate?: Date; endDate?: Date },
  ) {
    return this.shipmentsService.getShopOverall({
      userId,
      shopSlug: id,
      ...range,
    });
  }

  async shipments(shopId: string, f: { take: number; skip: number }) {
    return await this.shipmentsService.listWithTotalByShop(shopId, f);
  }
}
