import { CatalogueEntry } from 'src/catalogue/entities/catalogue.entity';

export class Cart {}

export class CartEntry {
  catalogueEntry: CatalogueEntry & { image: string };
  quantity: number;
}
