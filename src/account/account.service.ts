import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { ListDto } from 'src/dto/list.dto';
import { Factory } from 'src/factories/entities/factory.entity';
import { FactoriesService } from 'src/factories/factories.service';
import { UsersService } from 'src/users/users.service';
import { CreateFactoryDto } from './dto/create-factory.dto';
import { ShopsService } from 'src/shops/shops.service';
import { CreateShopDto } from 'src/shops/dto/create-shop.dto';

@Injectable()
export class AccountService {
  private readonly logger = new Logger('AccountService');

  constructor(
    private readonly usersService: UsersService,
    private readonly factoryService: FactoriesService,
    private readonly shopService: ShopsService,
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

  updateAvatar(
    id: string,
    file: Express.Multer.File,
  ): string | PromiseLike<string> {
    return this.usersService.updateAvatar(id, file);
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

  async getFactories(id: string): Promise<ListDto<Factory>> {
    return await this.factoryService.findAll({ ownerId: id });
  }
}
