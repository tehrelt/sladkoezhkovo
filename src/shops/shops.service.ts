import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopDto } from './dto/update-shop.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { MinioService } from 'src/minio/minio.service';
import { Bucket } from 'src/minio/minio.consts';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import e from 'express';

@Injectable()
export class ShopsService {
  private readonly logger = new Logger(ShopsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly minio: MinioService,
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

  findAll() {
    return `This action returns all shops`;
  }

  findOne(id: number) {
    return `This action returns a #${id} shop`;
  }

  update(id: number, dto: UpdateShopDto) {
    return `This action updates a #${id} shop`;
  }

  remove(id: number) {
    return `This action removes a #${id} shop`;
  }
}
