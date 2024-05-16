import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { PropertyTypesService } from './propertytypes.service';
import { CreatePropertyTypeDto } from './dto/create-propertytype.dto';
import { UpdatePropertyTypeDto } from './dto/update-propertytype.dto';
import { ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Типы собственности')
@Controller('propertytypes')
export class PropertyTypesController {
  constructor(private readonly propertytypesService: PropertyTypesService) {}

  @Post()
  @RequiredAuth('ADMIN')
  create(@Body() createPropertytypeDto: CreatePropertyTypeDto) {
    return this.propertytypesService.create(createPropertytypeDto);
  }

  @Get()
  @RequiredAuth('ADMIN')
  findAll() {
    return this.propertytypesService.findAll();
  }

  @Get(':id')
  @RequiredAuth('ADMIN')
  findOne(@Param('id') id: string) {
    return this.propertytypesService.findOne(id);
  }

  @Patch(':id')
  @RequiredAuth('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updatePropertytypeDto: UpdatePropertyTypeDto,
  ) {
    return this.propertytypesService.update(id, updatePropertytypeDto);
  }

  @Delete(':id')
  @RequiredAuth('ADMIN')
  remove(@Param('id') id: string) {
    return this.propertytypesService.remove(id);
  }
}
