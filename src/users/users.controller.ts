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
import { PromoteUserDto } from './dto/promote-user.dto';
import { User } from './entities/user.entity';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  private readonly logger = new Logger('UsersController');

  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequiredAuth('admin')
  async findAll(@Query('role') role?: string) {
    const uu = await this.usersService.findAll({
      role: role ? { name: role } : undefined,
    });

    this.logger.log(`findAll`, uu);

    const dtos = await Promise.all(
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
          role: u.role.name,
          imageLink: image,
          createdAt: u.createdAt,
          updatedAt: u.updatedAt,
        };
        return dto;
      }),
    );
    this.logger.log(`dto`, dtos);
    return dtos;
  }

  @Get(':id')
  @RequiredAuth('admin')
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
      role: u.role.name,
      imageLink: image,
      createdAt: u.createdAt,
      updatedAt: u.updatedAt,
    };
  }

  @Patch(':slug')
  @RequiredAuth('admin')
  async promoteUser(@Param('slug') slug: string, @Body() dto: PromoteUserDto) {
    return await this.usersService.promote(slug, dto.role);
  }
}
