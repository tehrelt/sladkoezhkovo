export class Shop {
  id: string;
  handle: string;
  name: string;
  phoneNumber: string;
  address: {
    city: string;
    district: string;
  };
  employeeCount: number;
  owner: string;
  openSince: number;
  image?: string;
}
