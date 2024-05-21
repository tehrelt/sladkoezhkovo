import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { Prisma } from '@prisma/client';

@Injectable()
export class ShipmentsService {
  private readonly logger = new Logger(ShipmentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateShipmentDto) {
    if (dto.entries.length === 0) {
      throw new BadRequestException('Пустой заказ невозможен');
    }
    const id = uuidv7();

    if (!dto.shop) {
      this.logger.error('Не указана ссылка на магазин', dto);
    }

    this.logger.verbose(`Создание заказа`, { id, dto });

    const r = await this.prisma.shipment.create({
      data: {
        id,
        shop: { connect: { handle: dto.shop } },
        ShipmentEntry: {
          createMany: {
            data: dto.entries.map((e) => {
              const i: Prisma.ShipmentEntryCreateManyShipmentInput = {
                catalogueId: e.catalogueId,
                cost: e.cost,
                units: e.quantity,
              };
              return i;
            }),
          },
        },
        Notification: {
          create: { id: uuidv7() },
        },
      },
    });

    return r;
  }
}
