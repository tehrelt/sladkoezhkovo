import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { ListDto } from 'src/dto/list.dto';
import { City } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Города')
@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @RequiredAuth('ADMIN')
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  @RequiredAuth('ADMIN')
  async findAll(): Promise<ListDto<City>> {
    return this.citiesService.findAll();
  }

  @Get(':id')
  @RequiredAuth('ADMIN')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }
}
