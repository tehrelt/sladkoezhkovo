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
import { DistrictsService } from './districts.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Районы')
@Controller('districts')
export class DistrictsController {
  constructor(private readonly service: DistrictsService) {}

  @Post()
  @RequiredAuth('ADMIN', 'MODERATOR')
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.service.create(createDistrictDto);
  }

  @Get()
  @RequiredAuth()
  findAll(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('cityId') cityId?: string,
  ) {
    return this.service.findAll({
      take: limit ? +limit : undefined,
      skip: page && limit ? +page * +limit : undefined,
      cityId,
    });
  }

  @Get(':id')
  @RequiredAuth('ADMIN', 'MODERATOR')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @RequiredAuth('ADMIN', 'MODERATOR')
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.service.update(id, updateDistrictDto);
  }

  @Get(':id/deps')
  @RequiredAuth('ADMIN', 'MODERATOR')
  deps(@Param('id') id: string) {
    return this.service.deps(id);
  }

  @Delete(':id')
  @RequiredAuth('ADMIN', 'MODERATOR')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
