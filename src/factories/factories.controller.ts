import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
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
  constructor(private readonly factoriesService: FactoriesService) {}

  // @Post()
  // create(@Body() createFactoryDto: CreateFactoryDto) {
  //   return this.factoriesService.create(createFactoryDto);
  // }

  // @Get()
  // findAll() {
  //   return this.factoriesService.findAll();
  // }

  @Get(':slug')
  @RequiredAuth()
  findOne(@Param('slug') slug: string) {
    return this.factoriesService.findOne(slug);
  }

  @Get(':slug/products')
  @RequiredAuth()
  findProducts(@Param('slug') slug: string) {
    return this.factoriesService.findProducts(slug);
  }

  @Patch(':id')
  @RequiredAuth()
  @UploadFile('file')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateFactoryDto,
    @UploadedFile('file') file?: Express.Multer.File,
  ) {
    return this.factoriesService.update(id, { ...dto, file });
  }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.factoriesService.remove(+id);
  // }
}
