import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { PromoteUserDto } from './dto/promote-user.dto';

@ApiTags('Пользователи')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @RequiredAuth('admin')
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @RequiredAuth('admin')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':slug')
  @RequiredAuth('admin')
  async promoteUser(@Param('slug') slug: string, @Body() dto: PromoteUserDto) {
    return await this.usersService.promote(slug, dto.role);
  }
}
