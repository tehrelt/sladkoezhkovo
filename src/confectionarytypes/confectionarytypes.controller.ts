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
import { ConfectionaryTypesService } from './confectionarytypes.service';
import { CreateConfectionaryTypeDto } from './dto/create-confectionarytype.dto';
import { UpdateConfectionarytypeDto } from './dto/update-confectionarytype.dto';
import { ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Тип сладости')
@Controller('confectionary-types')
export class ConfectionarytypesController {
  constructor(private readonly service: ConfectionaryTypesService) {}

  @Post()
  @RequiredAuth('ADMIN')
  create(@Body() createConfectionarytypeDto: CreateConfectionaryTypeDto) {
    return this.service.create(createConfectionarytypeDto);
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
  @RequiredAuth('ADMIN')
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @RequiredAuth('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateConfectionarytypeDto: UpdateConfectionarytypeDto,
  ) {
    return this.service.update(id, updateConfectionarytypeDto);
  }

  @Delete(':id')
  @RequiredAuth('ADMIN')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
