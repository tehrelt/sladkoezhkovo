import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UploadedFile,
} from '@nestjs/common';
import { FactoriesService } from './factories.service';
import { ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { UpdateFactoryDto } from './dto/update-factory.dto';
import { UploadFile } from 'src/decorators/upload.decorator';

@ApiTags('Фабрики')
@Controller('factories')
export class FactoriesController {
  constructor(private readonly service: FactoriesService) {}

  @Get()
  findAll(@Query('limit') limit?: string, @Query('page') page?: string) {
    return this.service.findAll({
      take: limit ? +limit : undefined,
      skip: page && limit ? +page * +limit : undefined,
    });
  }

  @Get(':slug')
  @RequiredAuth()
  findOne(@Param('slug') slug: string) {
    return this.service.findOne(slug);
  }

  @Get(':slug/products')
  @RequiredAuth()
  findProducts(@Param('slug') slug: string) {
    return this.service.findProducts(slug);
  }

  @Patch(':id')
  @RequiredAuth()
  @UploadFile('file')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFactoryDto,
    @UploadedFile('file') file?: Express.Multer.File,
  ) {
    return this.service.update(id, { ...dto, file });
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.factoriesService.remove(+id);
  // }
}
