import { City } from 'src/cities/entities/city.entity';

export class Factory {
  id: string;
  name: string;
  handle: string;
  owner: {
    lastName: string;
    firstName: string;
    middleName: string;
    handle: string;
  };
  city: City;
  year: number;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}
