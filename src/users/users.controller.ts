import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { User } from './entities/user.entity';
import { ListDto } from 'src/dto/list.dto';
import { ROLE } from 'src/enum/role.enum';
import { UpdateUserDto } from './dto/update-user.dto';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger('UsersController');

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequiredAuth('ADMIN')
  async findAll(@Query('role') role?: string): Promise<ListDto<User>> {
    const r: ROLE = role ? (role as ROLE) : undefined;
    const { users: uu, count } = await this.usersService.findAll({
      role: r,
    });

    this.logger.log(`findAll`, uu);

    const items = await Promise.all(
      uu.map(async (u) => {
        const image = u.image
          ? await this.usersService.getAvatarLink(u.image?.name)
          : null;
        const dto = {
          id: u.id,
          lastName: u.lastName,
          firstName: u.firstName,
          middleName: u.middleName,
          handle: u.handle,
          email: u.email,
          role: u.role,
          imageLink: image,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        };
        return dto;
      }),
    );
    this.logger.log({ items, count });
    return { items, count };
  }

  @Get(':id')
  @RequiredAuth()
  async findOne(@Param('id') id: string): Promise<User> {
    const u = await this.usersService.findOne(id);
    const image = u.image
      ? await this.usersService.getAvatarLink(u.image?.name)
      : null;
    return {
      id: u.id,
      lastName: u.lastName,
      firstName: u.firstName,
      middleName: u.middleName,
      handle: u.handle,
      email: u.email,
      role: u.role,
      imageLink: image,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }

  @Patch(':id')
  @RequiredAuth('ADMIN')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }
}
