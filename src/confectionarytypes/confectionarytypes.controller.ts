import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ConfectionaryTypesService } from './confectionarytypes.service';
import { CreateConfectionaryTypeDto } from './dto/create-confectionarytype.dto';
import { UpdateConfectionarytypeDto } from './dto/update-confectionarytype.dto';
import { ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Тип сладости')
@Controller('confectionarytypes')
export class ConfectionarytypesController {
  constructor(
    private readonly confectionarytypesService: ConfectionaryTypesService,
  ) {}

  @Post()
  @RequiredAuth('ADMIN')
  create(@Body() createConfectionarytypeDto: CreateConfectionaryTypeDto) {
    return this.confectionarytypesService.create(createConfectionarytypeDto);
  }

  @Get()
  @RequiredAuth('ADMIN')
  findAll() {
    return this.confectionarytypesService.findAll();
  }

  @Get(':id')
  @RequiredAuth('ADMIN')
  findOne(@Param('id') id: string) {
    return this.confectionarytypesService.findOne(id);
  }

  @Patch(':id')
  @RequiredAuth('ADMIN')
  update(
    @Param('id') id: string,
    @Body() updateConfectionarytypeDto: UpdateConfectionarytypeDto,
  ) {
    return this.confectionarytypesService.update(
      id,
      updateConfectionarytypeDto,
    );
  }

  @Delete(':id')
  @RequiredAuth('ADMIN')
  remove(@Param('id') id: string) {
    return this.confectionarytypesService.remove(id);
  }
}
