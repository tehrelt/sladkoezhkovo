import { Decimal } from '@prisma/client/runtime/library';

export class Shipment {}

export class ShipmentListEntry {
  id: string;
  shop: {
    name: string;
    handle: string;
  };
  cost: Decimal;
  createdAt: Date;
}
