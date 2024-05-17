import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ProfileDto } from 'src/auth/dto/profile.dto';
import { ListDto } from 'src/dto/list.dto';
import { Factory } from 'src/factories/entities/factory.entity';
import { FactoriesService } from 'src/factories/factories.service';
import { UsersService } from 'src/users/users.service';
import { CreateFactoryDto } from './dto/create-factory.dto';

@Injectable()
export class AccountService {
  private readonly logger = new Logger('AccountService');

  constructor(
    private readonly usersService: UsersService,
    private readonly factoryService: FactoriesService,
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
    return await this.factoryService.create({ ...dto, ownerId: id, file });
  }

  async getFactories(id: string): Promise<ListDto<Factory>> {
    return await this.factoryService.findAll({ ownerId: id });
  }
}
