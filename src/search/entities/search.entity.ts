export class SearchResults {
  users: UserResult[];
  factories: FactoryResult[];
  products: ProductResult[];
}

export class UserResult {
  handle: string;
  lastName: string;
  firstName: string;
  middleName: string;
  image?: string;
}

export class FactoryResult {
  handle: string;
  name: string;
  image?: string;
}

export class ProductResult {
  id: string;
  name: string;
  image?: string;
}
