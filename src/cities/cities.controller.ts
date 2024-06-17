import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';
import { DepsDto } from 'src/dto/deps.dto';

@ApiTags('Города')
@Controller('cities')
export class CitiesController {
  constructor(private readonly services: CitiesService) {}

  @Post()
  @RequiredAuth('ADMIN')
  create(@Body() createCityDto: CreateCityDto) {
    return this.services.create(createCityDto);
  }

  @Get()
  @RequiredAuth()
  findAll(@Query('limit') limit?: string, @Query('page') page?: string) {
    return this.services.findAll({
      take: limit ? +limit : undefined,
      skip: page && limit ? +page * +limit : undefined,
    });
  }

  @Get(':id')
  @RequiredAuth()
  findOne(@Param('id') id: string) {
    return this.services.findOne(id);
  }

  @Get(':id/deps')
  @RequiredAuth('ADMIN', 'MODERATOR')
  async deps(@Param('id') id: string): Promise<DepsDto> {
    return await this.services.deps(id);
  }

  @Delete(':id')
  @RequiredAuth('ADMIN', 'MODERATOR')
  remove(@Param('id') id: string) {
    return this.services.remove(id);
  }
}
