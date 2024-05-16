import { Controller } from '@nestjs/common';
import { FactoriesService } from './factories.service';
import { ApiTags } from '@nestjs/swagger';

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

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.factoriesService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateFactoryDto: UpdateFactoryDto) {
  //   return this.factoriesService.update(+id, updateFactoryDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.factoriesService.remove(+id);
  // }
}
