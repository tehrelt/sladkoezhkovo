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

export class Reciept {
  shipmentId: string;
  entries: RecieptEntry[];
  reciever: {
    name: string;
    handle: string;
    image?: string;
  };
  total: Decimal;
  createdAt: Date;
}

export class RecieptEntry {
  catalogueId: string;
  productId: string;
  name: string;
  unit: string;
  cost: Decimal;
  quantity: string;
  amount: Decimal;
  image?: string;
  factory: {
    name: string;
    handle: string;
    image?: string;
  };
  confectionaryType: string;
  package: string;
  unitUsage: number;
}
