import { Controller, Post, Body } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { CreateShipmentDto } from './dto/create-shipment.dto';

@Controller('shipments')
export class ShipmentsController {
  constructor(private readonly shipmentsService: ShipmentsService) {}

  // @Post()
  // create(@Body() createShipmentDto: CreateShipmentDto) {
  //   return this.shipmentsService.create(createShipmentDto);
  // }
}
