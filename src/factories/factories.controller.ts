import { Controller, Get, Param } from '@nestjs/common';
import { FactoriesService } from './factories.service';
import { ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

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

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFactoryDto: UpdateFactoryDto) {
  //   return this.factoriesService.update(+id, updateFactoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.factoriesService.remove(+id);
  // }
}
