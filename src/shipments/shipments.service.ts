import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { Prisma } from '@prisma/client';
import { FiltersDto } from 'src/dto/filters.dto';
import { ListDto } from 'src/dto/list.dto';
import { ShipmentListEntry } from './entities/shipment.entity';
import { Decimal } from '@prisma/client/runtime/library';

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

  async listWithTotal(
    userId: string,
    f?: FiltersDto,
  ): Promise<ListDto<ShipmentListEntry>> {
    this.logger.verbose(`Список заказов`, { userId, f });

    const r = await this.prisma.$queryRaw<
      {
        id: string;
        name: string;
        handle: string;
        total: Decimal;
        createdAt: Date;
      }[]
    >`select 
	s.id, 
	sh.name, 
	sh.handle,
	(
		select SUM(se2.units * se2.cost) as total FROM shipment_entries se2
		WHERE se2.shipment_id = s.id
		GROUP BY se2.shipment_id
	) AS total,
  s.created_at AS "createdAt"
FROM shipments s
	INNER JOIN shops sh ON s.shop_id = sh.id
	WHERE sh.owner_id = ${userId}
  ORDER BY s.created_at DESC
  LIMIT ${f.take || 10} OFFSET ${f.skip || 0}`;

    const count = await this.prisma.shipment.count({
      where: { shop: { ownerId: userId } },
    });

    this.logger.verbose(`Количество заказов`, { count });

    return {
      items: r.map((e) => ({
        id: e.id,
        shop: {
          name: e.name,
          handle: e.handle,
        },
        cost: e.total,
        createdAt: e.createdAt,
      })),
      count,
    };
  }
}
