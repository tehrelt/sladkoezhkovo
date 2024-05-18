import { Decimal } from '@prisma/client/runtime/library';
import { Package } from 'src/packages/entities/package.entity';
import { Unit } from 'src/units/entities/unit.entity';

export class CatalogueEntry {
  id: string;
  productId: string;
  unit: Unit;
  package: Package;
  price: Decimal;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}
