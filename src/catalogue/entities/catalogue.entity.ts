import { Decimal } from '@prisma/client/runtime/library';
import { Package } from 'src/packages/entities/package.entity';

export class CatalogueEntry {
  id: string;
  package: Package;
  price: Decimal;
  unitUsage: number;
  product: Product;
  factory: Factory;
  createdAt: Date;
  updatedAt: Date;
}

class Product {
  id: string;
  name: string;
  confectionaryType: string;
  image?: string;
}

class Factory {
  name: string;
  handle: string;
}
