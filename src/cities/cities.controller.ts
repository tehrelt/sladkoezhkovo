import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
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
  @RequiredAuth()
  findAll(@Query('limit') limit?: string, @Query('page') page?: string) {
    return this.citiesService.findAll({
      take: limit ? +limit : undefined,
      skip: page && limit ? +page * +limit : undefined,
    });
  }

  @Get(':id')
  @RequiredAuth()
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }
}
