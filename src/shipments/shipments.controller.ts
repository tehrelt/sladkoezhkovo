import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ShipmentsService } from './shipments.service';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { UserClaims } from 'src/auth/dto/user-claims.dto';
import { ROLE } from 'src/enum/role.enum';

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

  @Get(':id')
  @RequiredAuth('FACTORY_OWNER', 'SHOP_OWNER')
  findOne(@User() user: UserClaims, @Param('id') id: string) {
    return this.service.findOne({
      shipmentId: id,
      user: { role: user.role as ROLE, id: user.id },
    });
  }
}
