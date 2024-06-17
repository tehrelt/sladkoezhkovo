import { Decimal } from '@prisma/client/runtime/library';
import { CatalogueEntry } from 'src/catalogue/entities/catalogue.entity';

export class Product {
  id: string;
  name: string;
  weight: Decimal;
  confectionaryType: {
    id: string;
    name: string;
  };
  factory: {
    id: string;
    handle: string;
    name: string;
  };
  createdAt: Date;
  updatedAt: Date;
  image?: string;
  catalogueEntries?: Partial<CatalogueEntry>[];
}
