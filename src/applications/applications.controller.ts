import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApplicationsService } from './applications.service';
import { CreateApplicationDto } from './dto/create-application.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

@ApiTags('Заявки на регистрацию')
@Controller('applications')
export class ApplicationsController {
  constructor(private readonly applicationsService: ApplicationsService) {}

  @Post()
  @ApiOperation({ summary: 'Создание новой заявки на регистрацию' })
  create(@Body() dto: CreateApplicationDto) {
    return this.applicationsService.create(dto);
  }

  @Get()
  @RequiredAuth('ADMIN', 'MODERATOR')
  findAll(@Query('limit') limit?: string, @Query('page') page?: string) {
    return this.applicationsService.findAll({
      take: limit ? +limit : undefined,
      skip: page && limit ? +page * +limit : undefined,
    });
  }

  @Get(':id')
  @RequiredAuth('ADMIN', 'MODERATOR')
  findOne(@Param('id') id: string) {
    return this.applicationsService.findOne(id);
  }

  @Patch(':id/approve')
  @RequiredAuth('ADMIN', 'MODERATOR')
  approve(@Param('id') id: string) {
    return this.applicationsService.approve(id);
  }
}
