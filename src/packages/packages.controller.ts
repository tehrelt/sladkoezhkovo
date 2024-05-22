import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PackagesService } from './packages.service';
import { CreatePackageDto } from './dto/create-package.dto';
import { UpdatePackageDto } from './dto/update-package.dto';
import { ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Тип фасовки')
@Controller('packages')
export class PackagesController {
  constructor(private readonly service: PackagesService) {}

  @Post()
  @RequiredAuth('ADMIN')
  create(@Body() dto: CreatePackageDto) {
    return this.service.create(dto);
  }

  @Get()
  @RequiredAuth()
  findAll(@Query('limit') limit?: string, @Query('page') page?: string) {
    return this.service.findAll({
      take: limit ? +limit : undefined,
      skip: page && limit ? +page * +limit : undefined,
    });
  }

  @Get(':id')
  @RequiredAuth()
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @RequiredAuth('ADMIN')
  update(@Param('id') id: string, @Body() updatePackageDto: UpdatePackageDto) {
    return this.service.update(id, updatePackageDto);
  }

  @Get(':id/deps')
  @RequiredAuth('ADMIN', 'MODERATOR')
  deps(@Param('id') id: string) {
    return this.service.deps(id);
  }

  @Delete(':id')
  @RequiredAuth('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
