import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { DistrictsService } from './districts.service';
import { CreateDistrictDto } from './dto/create-district.dto';
import { UpdateDistrictDto } from './dto/update-district.dto';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Районы')
@Controller('districts')
export class DistrictsController {
  constructor(private readonly districtsService: DistrictsService) {}

  @Post()
  @RequiredAuth('ADMIN', 'MODERATOR')
  create(@Body() createDistrictDto: CreateDistrictDto) {
    return this.districtsService.create(createDistrictDto);
  }

  @Get()
  @RequiredAuth('ADMIN', 'MODERATOR')
  findAll() {
    return this.districtsService.findAll();
  }

  @Get(':id')
  @RequiredAuth('ADMIN', 'MODERATOR')
  findOne(@Param('id') id: string) {
    return this.districtsService.findOne(id);
  }

  @Patch(':id')
  @RequiredAuth('ADMIN', 'MODERATOR')
  update(
    @Param('id') id: string,
    @Body() updateDistrictDto: UpdateDistrictDto,
  ) {
    return this.districtsService.update(id, updateDistrictDto);
  }

  @Delete(':id')
  @RequiredAuth('ADMIN', 'MODERATOR')
  remove(@Param('id') id: string) {
    return this.districtsService.remove(id);
  }
}
