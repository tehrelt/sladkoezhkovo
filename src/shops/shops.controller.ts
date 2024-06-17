import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { ShopsService } from './shops.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RequiredAuth } from 'src/auth/decorators/auth.decorator';
import { User } from 'src/auth/decorators/user.decorator';
import { addDays } from 'src/lib/date';

@ApiTags('Магазины')
@Controller('shops')
export class ShopsController {
  private readonly logger = new Logger(ShopsController.name);

  constructor(private readonly service: ShopsService) {}

  @Get(':slug/overall')
  @RequiredAuth('SHOP_OWNER')
  async getOverall(
    @User('id') userId: string,
    @Param('slug') slug: string,
    @Query('start') start?: string,
    @Query('end') end?: string,
  ) {
    await this.service.checkOwner(slug, userId);

    return this.service.getOverall(slug, userId, {
      startDate: new Date(start),
      endDate: end ? new Date(end) : addDays(new Date(), 1),
    });
  }

  @Get(':slug')
  @RequiredAuth('SHOP_OWNER')
  async find(@Param('slug') slug: string, @User('id') userId: string) {
    await this.service.checkOwner(slug, userId);
    return this.service.find(slug);
  }

  @Get(':slug/shipments')
  @ApiOperation({ summary: 'Получение всех доставок' })
  @RequiredAuth()
  @ApiResponse({ status: 200 })
  async getShipments(
    @Param('slug') slug: string,
    @User('id') userId: string,
    @Query('limit') limit?: string,
    @Query('page') page?: string,
  ) {
    this.logger.verbose('getting shipments', { slug });
    await this.service.checkOwner(slug, userId);
    return await this.service.shipments(slug, {
      take: limit ? +limit : undefined,
      skip: page && limit ? +page * +limit : undefined,
    });
  }
}
