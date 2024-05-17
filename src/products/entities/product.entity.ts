export class Product {
  id: string;
  name: string;
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
}
