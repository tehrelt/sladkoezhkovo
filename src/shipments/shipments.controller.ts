import { Controller, Post, Body, Get } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly service: ShipmentsService) {}

  // @Post()
  // create(@Body() createShipmentDto: CreateShipmentDto) {
  //   return this.shipmentsService.create(createShipmentDto);
  // }

  @Get()
  @RequiredAuth()
  findAll() {
    // return this.service.findAll();
  }
}
