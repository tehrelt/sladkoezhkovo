import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  NotFoundException,
  ConflictException,
  Delete,
} from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Controller('roles')
@ApiTags('Роли')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Создание новой роли' })
  @ApiResponse({ status: 201 })
  async create(@Body() createRoleDto: CreateRoleDto) {
    try {
      return await this.rolesService.create(createRoleDto);
    } catch (e) {
      if (e instanceof PrismaClientKnownRequestError) {
        if (e.code == 'P2002') {
          throw new ConflictException('Role with this name already exists');
        }
      }
    }
  }

  @Get()
  @ApiOperation({ summary: 'Получение всех ролей' })
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Получение роли по id или названию' })
  async findOne(@Param('slug') slug: string) {
    const role = await this.rolesService.findOne(slug);
    if (!role) {
      throw new NotFoundException('role not found');
    }

    return role;
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Удаление роли по id или названию' })
  async remove(@Param('slug') slug: string) {
    try {
      const role = await this.rolesService.remove(slug);
      return role;
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        throw new NotFoundException('role not found');
      }
    }
  }
}
