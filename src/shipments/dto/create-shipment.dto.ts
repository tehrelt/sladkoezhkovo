import { Decimal } from '@prisma/client/runtime/library';

export class CreateShipmentDto {
  shop: string;
  entries: ShipmentEntryDto[];
}

export class ShipmentEntryDto {
  catalogueId: string;
  quantity: number;
  cost: Decimal;
}
