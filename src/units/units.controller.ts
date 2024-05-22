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
  Query,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Ед. измерения')
@Controller('units')
export class UnitsController {
  constructor(private readonly service: UnitsService) {}

  @Post()
  @RequiredAuth('ADMIN')
  @UsePipes(ValidationPipe)
  create(@Body() createUnitDto: CreateUnitDto) {
    return this.service.create(createUnitDto);
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
    const unit = this.service.findOne(id);
    if (!unit) {
      throw new NotFoundException();
    }
    return unit;
  }

  @Patch(':id')
  @RequiredAuth('ADMIN')
  @UsePipes(ValidationPipe)
  update(@Param('id') id: string, @Body() updateUnitDto: UpdateUnitDto) {
    return this.service.update(id, updateUnitDto);
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
