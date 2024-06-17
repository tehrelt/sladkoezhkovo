import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateShipmentDto } from './dto/create-shipment.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { uuidv7 } from 'uuidv7';
import { Prisma } from '@prisma/client';
import { FiltersDto } from 'src/dto/filters.dto';
import { ListDto } from 'src/dto/list.dto';
import { Reciept, ShipmentListEntry } from './entities/shipment.entity';
import { Decimal } from '@prisma/client/runtime/library';
import { ROLE } from 'src/enum/role.enum';
import { ProductsService } from 'src/products/products.service';
import { isUUID } from 'class-validator';
import { datef } from 'src/lib/date';

@Injectable()
export class ShipmentsService {
  private readonly logger = new Logger(ShipmentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly productsService: ProductsService,
  ) {}

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

  async listWithTotalByShop(
    shopSlug: string,
    f?: FiltersDto,
  ): Promise<ListDto<ShipmentListEntry>> {
    this.logger.verbose(`Список заказов`, { shopId: shopSlug, f });

    const where = isUUID(shopSlug)
      ? `sh.id = '${shopSlug}'`
      : `sh.handle = '${shopSlug}'`;

    const r = await this.prisma.$queryRawUnsafe<
      {
        id: string;
        name: string;
        handle: string;
        total: Decimal;
        createdAt: Date;
      }[]
    >(`select 
	s.id, 
	sh.name, 
	sh.handle,
	(
		select SUM(se2.cost) as total FROM shipment_entries se2
		WHERE se2.shipment_id = s.id
		GROUP BY se2.shipment_id
	) AS total,
  s.created_at AS "createdAt"
FROM shipments s
	INNER JOIN shops sh ON s.shop_id = sh.id
	WHERE ${where}
  ORDER BY s.created_at DESC
  LIMIT ${f.take || 10} OFFSET ${f.skip || 0}`);

    const count = await this.prisma.shipment.count({
      where: { shopId: shopSlug },
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
		select SUM(se2.cost) as total FROM shipment_entries se2
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

  async findOne(query: {
    shipmentId: string;
    user: { role: ROLE; id: string };
  }): Promise<Reciept> {
    if (!['SHOP_OWNER', 'FACTORY_OWNER'].includes(query.user.role)) {
      throw new ForbiddenException('Недостаточно прав');
    }

    return query.user.role == 'SHOP_OWNER'
      ? this.findForShop(query.shipmentId, query.user.id)
      : this.findForFactory(query.shipmentId, query.user.id);
  }

  async findForShop(shipmentId: string, userId: string): Promise<Reciept> {
    const owner = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      select: {
        shop: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (owner.shop.ownerId !== userId) {
      throw new ForbiddenException('Недостаточно прав');
    }

    const r = await this.prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        shop: {
          select: {
            name: true,
            handle: true,
          },
        },
        ShipmentEntry: {
          select: {
            cost: true,
            units: true,
            catalogueId: true,
            entry: {
              select: {
                unitUsage: true,
                price: true,
                productId: true,
                package: {
                  select: {
                    name: true,
                    unit: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                product: {
                  select: {
                    name: true,
                    confectionaryType: {
                      select: {
                        name: true,
                      },
                    },
                    factory: {
                      select: {
                        name: true,
                        handle: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const total = await this.prisma.$queryRaw<
      {
        total: Decimal;
      }[]
    >`select SUM(se2.cost) as total FROM shipment_entries se2
WHERE se2.shipment_id = ${shipmentId}
GROUP BY se2.shipment_id`;

    if (!r) {
      throw new NotFoundException('Заказ не найден');
    }

    return {
      shipmentId,
      reciever: r.shop,
      total: total[0].total,
      createdAt: r.createdAt,
      entries: await Promise.all(
        r.ShipmentEntry.map(async (e) => ({
          catalogueId: e.catalogueId,
          cost: e.entry.price,
          amount: e.cost,
          factory: e.entry.product.factory,
          name: e.entry.product.name,
          productId: e.entry.productId,
          quantity: e.units.toString(),
          unit: e.entry.package.unit.name,
          confectionaryType: e.entry.product.confectionaryType.name,
          package: e.entry.package.name,
          unitUsage: e.entry.unitUsage,
          image: await this.productsService.getProductImage(e.entry.productId),
        })),
      ),
    };
  }

  async findForFactory(shipmentId: string, userId: string): Promise<Reciept> {
    const r = await this.prisma.shipment.findFirst({
      where: {
        AND: [
          { id: shipmentId },
          {
            ShipmentEntry: {
              some: {
                entry: {
                  product: { factory: { ownerId: { equals: userId } } },
                },
              },
            },
          },
        ],
      },
      include: {
        shop: {
          select: {
            name: true,
            handle: true,
          },
        },
        ShipmentEntry: {
          select: {
            units: true,
            cost: true,
            catalogueId: true,
            entry: {
              select: {
                unitUsage: true,
                price: true,
                productId: true,
                package: {
                  select: {
                    name: true,
                    unit: {
                      select: {
                        name: true,
                      },
                    },
                  },
                },
                product: {
                  select: {
                    name: true,
                    confectionaryType: {
                      select: {
                        name: true,
                      },
                    },
                    factory: {
                      select: {
                        name: true,
                        handle: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const total = await this.prisma.$queryRaw<
      {
        total: Decimal;
      }[]
    >`select SUM(se2.units * se2.cost) as total FROM shipment_entries se2
  join catalogue c ON se2.catalogue_id = c.id
	join products p ON c.product_id = p.id
  join factories f ON p.factory_id = f.id
WHERE se2.shipment_id = ${shipmentId} AND f.owner_id = ${userId} 
GROUP BY se2.shipment_id`;

    return {
      reciever: r.shop,
      shipmentId: r.id,
      total: total[0].total,
      createdAt: r.createdAt,
      entries: r.ShipmentEntry.map((e) => ({
        catalogueId: e.catalogueId,
        cost: e.entry.price,
        amount: Decimal.mul(e.cost, e.units.toString()),
        factory: e.entry.product.factory,
        name: e.entry.product.name,
        productId: e.entry.productId,
        quantity: e.units.toString(),
        unit: e.entry.package.unit.name,
        confectionaryType: e.entry.product.confectionaryType.name,
        package: e.entry.package.name,
        unitUsage: e.entry.unitUsage,
      })),
    };
  }

  async getShopOverall(f: {
    shopSlug?: string;
    userId: string;
    startDate?: Date;
    endDate?: Date;
  }) {
    const where = [];

    if (f.startDate) {
      where.push(`se.created_at >= '${datef(f.startDate, 'MM-DD-YYYY')}'`);
    }

    if (f.endDate) {
      where.push(`se.created_at <= '${datef(f.endDate, 'MM-DD-YYYY')}'`);
    }

    if (f.shopSlug) {
      where.push(
        isUUID(f.shopSlug)
          ? `s.shop_id = '${f.shopSlug}'`
          : `sh.handle = '${f.shopSlug}'`,
      );
    }

    const q = `select SUM(se.cost) FROM shipment_entries se
	join shipments s ON se.shipment_id = s.id
  join shops sh ON s.shop_id = sh.id
	WHERE ${where.join(' AND ')};`;

    this.logger.verbose('query', q);

    const r = await this.prisma.$queryRawUnsafe<
      {
        sum: string;
      }[]
    >(q);

    return {
      total: r[0].sum,
    };
  }
}
