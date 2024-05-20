import { Injectable } from '@nestjs/common';
import { CreateCartEntryDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ListDto } from 'src/dto/list.dto';
import { ProductsService } from 'src/products/products.service';
import { Prisma } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CartService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly productService: ProductsService,
  ) {}

  create(dto: CreateCartEntryDto) {
    const r = this.prisma.cart.create({
      data: {
        userId: dto.userId,
        catalogueId: dto.catalogueId,
        quantity: dto.quantity,
      },
    });

    return r;
  }

  async findAll(f?: {
    userId: string;
  }): Promise<ListDto<any> & { total: Decimal }> {
    const entries = await this.prisma.cart.findMany({
      where: f,
      include: {
        catalogueEntry: {
          include: {
            package: true,
            product: { include: { image: true } },
          },
        },
      },
    });

    const items = await Promise.all(
      entries.map(async (entry) => {
        const image = await this.productService.getProductImage(
          entry.catalogueEntry.product.id,
        );
        return {
          ...entry,
          image,
          total: Prisma.Decimal.mul(entry.catalogueEntry.price, entry.quantity),
        };
      }),
    );

    const count = await this.prisma.cart.count({ where: f });

    const total = await this.prisma.$queryRaw<{
      total: Decimal;
    }>`SELECT SUM(catalogue.price*c.quantity) as total  FROM carts c
JOIN catalogue ON c.catalogue_id = catalogue.id
WHERE c.user_id = ${f.userId}
GROUP BY c.user_id`;

    return { items, count, total: total[0].total };
  }

  update(id: string, dto: UpdateCartDto) {
    return `This action updates a #${id} cart`;
  }

  async remove(userId: string, catalogueId: string) {
    await this.prisma.cart.delete({
      where: { userId_catalogueId: { userId, catalogueId } },
    });
  }
}
