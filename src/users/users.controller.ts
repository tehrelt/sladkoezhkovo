import { Controller, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

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
}
