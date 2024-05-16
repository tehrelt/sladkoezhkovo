import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  NotFoundException,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Ед. измерения')
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @RequiredAuth('ADMIN')
  @UsePipes(ValidationPipe)
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.unitsService.create(createUnitDto);
  }

  @Get()
  @RequiredAuth('ADMIN')
  findAll() {
    return this.unitsService.findAll();
  }

  @Get(':id')
  @RequiredAuth('ADMIN')
  findOne(@Param('id') id: string) {
    const unit = this.unitsService.findOne(id);
    if (!unit) {
      throw new NotFoundException();
    }
    return unit;
  }

  @Patch(':id')
  @RequiredAuth('ADMIN')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.unitsService.update(id, updateUnitDto);
  }

  @Delete(':id')
  @RequiredAuth('ADMIN')
  remove(@Param('id') id: string) {
    return this.unitsService.remove(id);
  }
}
