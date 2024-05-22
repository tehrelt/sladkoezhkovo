import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Logger,
} from '@nestjs/common';
import { CatalogueService } from './catalogue.service';
import { CreateCatalogueDto } from './dto/create-catalogue.dto';
import { UpdateCatalogueDto } from './dto/update-catalogue.dto';
import { ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

@ApiTags('catalogue')
@Controller('catalogue')
export class CatalogueController {
  private readonly logger = new Logger('CatalogueController');

  constructor(private readonly catalogueService: CatalogueService) {}

  @Post()
  @RequiredAuth()
  create(@Body() dto: CreateCatalogueDto) {
    this.logger.verbose(`Catalogue create:`, dto);
    return this.catalogueService.create(dto);
  }

  @Get()
  async findAll(
    @Query('limit') limit?: string,
    @Query('page') page?: string,
    @Query('productId') productId?: string,
    @Query('confectionaryTypeId') confectionaryTypeId?: string[],
    @Query('packagesId') packagesId?: string[],
  ) {
    const r = await this.catalogueService.findAll({
      take: limit ? +limit : undefined,
      skip: page && limit ? +page * +limit : undefined,
      productId,
      product: {
        confectionaryType: {
          id: { in: confectionaryTypeId },
        },
      },
      package: {
        id: { in: packagesId },
      },
    });
    this.logger.verbose(`Catalogue findAll:`, r);
    return r;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.catalogueService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateCatalogueDto) {
    return this.catalogueService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.catalogueService.remove(id);
  }
}
