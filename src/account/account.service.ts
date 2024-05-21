import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { FactoriesService } from 'src/factories/factories.service';
import { UsersService } from 'src/users/users.service';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { ShopsService } from 'src/shops/shops.service';
import { CreateShopDto } from 'src/shops/dto/create-shop.dto';
import { CartService } from 'src/cart/cart.service';
import { ListDto } from 'src/dto/list.dto';
import { CartEntry } from 'src/cart/entities/cart.entity';
import { CreateCartEntryDto } from 'src/cart/dto/create-cart.dto';
import { UpdateCartEntryDto } from 'src/cart/dto/update-cart.dto';
import { ShipmentsService } from 'src/shipments/shipments.service';
import { BuyCartDto } from './dto/buy.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AccountService {
  private readonly logger = new Logger('AccountService');

  constructor(
    private readonly usersService: UsersService,
    private readonly factoryService: FactoriesService,
    private readonly shopService: ShopsService,
    private readonly cartService: CartService,
    private readonly shipmentsService: ShipmentsService,
  ) {}

  async profile(id: string): Promise<ProfileDto> {
    const user = await this.usersService.findById(id);

    if (!user) {
      this.logger.error('user not found', { id });
      throw new BadRequestException('invalid user id');
    }

    this.logger.log('user found', user);

    const link = user.image
      ? await this.usersService.getAvatarLink(user.image.name)
      : null;

    return {
      id: user.id,
      handle: user.handle,
      firstName: user.firstName,
      lastName: user.lastName,
      middleName: user.middleName,
      email: user.email,
      imageLink: link,
      role: user.role,
    };
  }

  async cart(userId: string): Promise<ListDto<CartEntry>> {
    const entries = await this.cartService.findAll({ userId });
    return entries;
  }

  async addToCart(dto: CreateCartEntryDto) {
    const e = await this.cartService.create(dto);
    return e;
  }

  async updateCartEntry(dto: UpdateCartEntryDto) {
    const e = await this.cartService.update(dto.catalogueId, dto.userId, dto);
    return e;
  }

  async removeFromCart(userId: string, catalogueId: string) {
    await this.cartService.remove(userId, catalogueId);
  }

  async buy(dto: BuyCartDto) {
    const cart = await this.cart(dto.userId);

    try {
      this.shipmentsService.create({
        shop: dto.shop,
        entries: cart.items.map((i) => ({
          catalogueId: i.catalogueEntry.id,
          quantity: i.quantity,
          cost: Prisma.Decimal.mul(i.catalogueEntry.price, i.quantity),
        })),
      });
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }

    cart.items.forEach((i) =>
      this.removeFromCart(dto.userId, i.catalogueEntry.id),
    );
  }

  async createFactory(
    id: string,
    dto: CreateFactoryDto,
    file?: Express.Multer.File,
  ) {
    const r = await this.factoryService.create({ ...dto, ownerId: id, file });
    this.logger.debug('factory created', r);
    return r;
  }

  async createShop(id: string, dto: CreateShopDto, file?: Express.Multer.File) {
    const r = await this.shopService.create({ ...dto, ownerId: id, file });
    this.logger.debug('shop created', r);
    return r;
  }
}
