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
import { PropertyTypesService } from './propertytypes.service';
import { CreatePropertyTypeDto } from './dto/create-propertytype.dto';
import { UpdatePropertyTypeDto } from './dto/update-propertytype.dto';
import { ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Типы собственности')
@Controller('property-types')
export class PropertyTypesController {
  constructor(private readonly service: PropertyTypesService) {}

  @Post()
  @RequiredAuth('ADMIN')
  create(@Body() createPropertytypeDto: CreatePropertyTypeDto) {
    return this.service.create(createPropertytypeDto);
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
  update(
    @Param('id') id: string,
    @Body() updatePropertytypeDto: UpdatePropertyTypeDto,
  ) {
    return this.service.update(id, updatePropertytypeDto);
  }

  @Delete(':id')
  @RequiredAuth('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
