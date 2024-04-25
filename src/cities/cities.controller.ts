import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { CitiesService } from './cities.service';
import { CreateCityDto } from './dto/create-city.dto';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

@Controller('cities')
export class CitiesController {
  constructor(private readonly citiesService: CitiesService) {}

  @Post()
  @RequiredAuth('admin')
  create(@Body() createCityDto: CreateCityDto) {
    return this.citiesService.create(createCityDto);
  }

  @Get()
  @RequiredAuth('admin')
  findAll() {
    return this.citiesService.findAll();
  }

  @Get(':id')
  @RequiredAuth('admin')
  findOne(@Param('id') id: string) {
    return this.citiesService.findOne(id);
  }
}
