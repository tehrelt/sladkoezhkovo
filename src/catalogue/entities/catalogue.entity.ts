import { Decimal } from '@prisma/client/runtime/library';
import { Package } from 'src/packages/entities/package.entity';

export class CatalogueEntry {
  id: string;
  productId: string;
  package: Package;
  price: Decimal;
  unitUsage: number;
  createdAt: Date;
  updatedAt: Date;
}
