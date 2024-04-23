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
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { Role } from './entities/role.entity';
import { ErrorDto } from 'src/dto/error.dto';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

@Controller('roles')
@ApiTags('Роли')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Post()
  @ApiOperation({ summary: 'Создание новой роли' })
  @ApiResponse({ status: 201, type: Role })
  @ApiConflictResponse({ type: ErrorDto })
  @RequiredAuth('admin')
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
  @ApiResponse({ status: 200, type: [Role] })
  @RequiredAuth('admin')
  findAll() {
    return this.rolesService.findAll();
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Получение роли по id или названию' })
  @ApiResponse({ status: 200, type: Role })
  @ApiNotFoundResponse({ type: ErrorDto })
  @RequiredAuth('admin')
  async findOne(@Param('slug') slug: string) {
    const role = await this.rolesService.findOne(slug);
    if (!role) {
      throw new NotFoundException('role not found');
    }

    return role;
  }

  @Delete(':slug')
  @ApiOperation({ summary: 'Удаление роли по id или названию' })
  @ApiResponse({ status: 200, type: Role })
  @ApiNotFoundResponse({ type: ErrorDto })
  @RequiredAuth('admin')
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
