import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { UploadFile } from 'src/decorators/upload.decorator';

@Controller('products')
export class ProductsController {
  constructor(private readonly service: ProductsService) {}

  @Post()
  @RequiredAuth()
  @UploadFile('file')
  create(
    @Body() dto: CreateProductDto,
    @UploadedFile('file') file?: Express.Multer.File,
  ) {
    return this.service.create(dto, file);
  }

  @Get()
  @RequiredAuth('ADMIN', 'MODERATOR')
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
  @RequiredAuth()
  update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    return this.service.update(id, updateProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }

  @Get(':id/owner')
  @RequiredAuth()
  owner(@Param('id') id: string) {
    return this.service.owner(id);
  }
}
