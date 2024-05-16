import { Injectable, Logger } from '@nestjs/common';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { uuidv7 } from 'uuidv7';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { ListDto } from 'src/dto/list.dto';
import { Factory } from './entities/factory.entity';

@Injectable()
export class FactoriesService {
  private readonly logger = new Logger(FactoriesService.name);
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateFactoryDto) {
    const id = uuidv7();
    this.logger.verbose(`Creating a new factory`, { id, dto });
    return await this.prisma.factory.create({
      data: {
        id,
        handle: dto.handle,
        name: dto.name,
        phoneNumber: dto.phoneNumber,
        propertyTypeId: dto.propertyTypeId,
        cityId: dto.cityId,
        year: dto.year,
        ownerId: dto.ownerId,
      },
    });
  }

  async findAll(filters?: Prisma.FactoryWhereInput): Promise<ListDto<Factory>> {
    this.logger.verbose(`Getting all factories`, { filters });
    const items: Factory[] = (
      await this.prisma.factory.findMany({
        where: filters,
        include: { city: true, user: true },
      })
    ).map((f) => ({
      id: f.id,
      name: f.name,
      handle: f.handle,
      owner: f.user,
      city: f.city,
      phoneNumber: f.phoneNumber,
      year: f.year,
      createdAt: f.createdAt,
      updatedAt: f.updatedAt,
    }));

    return {
      items,
      count: await this.prisma.factory.count({ where: filters }),
    };
  }

  async findOne(slug: string): Promise<Factory> {
    const f = await this.prisma.factory.findFirst({
      where: { OR: [{ id: slug }, { handle: slug }] },
      include: { city: true, user: true },
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
    };
  }
}
