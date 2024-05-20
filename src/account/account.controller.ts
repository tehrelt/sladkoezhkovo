import {
  Body,
  Controller,
  Get,
  Post,
  Logger,
  Patch,
  UploadedFile,
  UsePipes,
  ValidationPipe,
  Delete,
  Param,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { UserClaims } from 'src/auth/dto/user-claims.dto';
import { AvatarUpdateResponseDto } from './dto/update-avatar.dto';
import { UploadFile } from 'src/decorators/upload.decorator';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { ListDto } from 'src/dto/list.dto';
import { Factory } from 'src/factories/entities/factory.entity';
import { CreateShopDto } from 'src/shops/dto/create-shop.dto';
import { CreateCartEntryDto } from 'src/cart/dto/create-cart.dto';

@ApiTags('Аккаунт пользователя')
@Controller('account')
export class AccountController {
  private readonly logger = new Logger('AccountController');

  constructor(private readonly service: AccountService) {}

  @Get('')
  @ApiOperation({ summary: 'Получение профиля авторизованного пользователя' })
  @RequiredAuth()
  @ApiResponse({ type: ProfileDto })
  async profile(@User() { id }: UserClaims): Promise<ProfileDto> {
    this.logger.verbose('getting profile', { id });
    const user = await this.service.profile(id);
    return user;
  }

  @Get('/cart')
  @ApiOperation({ summary: 'Получение корзины пользователя' })
  @RequiredAuth()
  async cart(@User() { id }: UserClaims) {
    this.logger.verbose('getting cart', { id });
    const cart = await this.service.cart(id);
    return cart;
  }

  @Post('/cart')
  @ApiOperation({ summary: 'Добавление товара в корзину' })
  @RequiredAuth()
  @UsePipes(ValidationPipe)
  async addToCart(
    @User('id') userId: string,
    @Body() dto: Omit<CreateCartEntryDto, 'userId'>,
  ) {
    this.logger.verbose('adding to cart', { userId, dto });
    const entry = await this.service.addToCart({ ...dto, userId });
    return entry;
  }

  @Delete('/cart/:id')
  @ApiOperation({ summary: 'Удаление товара из корзины' })
  @RequiredAuth()
  @UsePipes(ValidationPipe)
  @ApiResponse({ status: 200 })
  async removeFromCart(
    @User('id') userId: string,
    @Param('id') catalogueId: string,
  ) {
    this.logger.verbose('removing from cart', { userId, catalogueId });
    await this.service.removeFromCart(userId, catalogueId);
  }

  @Post('/add-factory')
  @ApiOperation({ summary: 'Добавление нового фабрики' })
  @RequiredAuth('FACTORY_OWNER')
  @UsePipes(ValidationPipe)
  @UploadFile('file')
  @ApiResponse({ status: 200 })
  async addFactory(
    @User('id') id: string,
    @Body() dto: CreateFactoryDto,
    @UploadedFile('file') file?: Express.Multer.File,
  ) {
    return await this.service.createFactory(
      id,
      { ...dto, year: Number(dto.year) },
      file,
    );
  }

  @Post('/add-shop')
  @ApiOperation({ summary: 'Добавление нового магазина' })
  @RequiredAuth('SHOP_OWNER')
  @UsePipes(ValidationPipe)
  @UploadFile('file')
  @ApiResponse({ status: 200 })
  async addShop(
    @User('id') id: string,
    @Body() dto: CreateShopDto,
    @UploadedFile('file') file?: Express.Multer.File,
  ) {
    this.logger.verbose('adding shop', { dto });
    return await this.service.createShop(
      id,
      {
        ...dto,
        employeesCount: Number(dto.employeesCount),
        openSince: Number(dto.openSince),
      },
      file,
    );
  }

  // @Get('/factories')
  // @ApiOperation({ summary: 'Получение всех фабрик' })
  // @RequiredAuth('FACTORY_OWNER')
  // async getFactories(@User('id') userId: string): Promise<ListDto<Factory>> {
  //   return await this.service.getFactories(userId);
  // }
}
