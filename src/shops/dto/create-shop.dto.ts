import { ApiProperty } from '@nestjs/swagger';

export class CreateShopDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  handle: string;
  @ApiProperty()
  districtId: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  ownerId: string;
  @ApiProperty()
  openSince: number;
  @ApiProperty()
  employeesCount: number;
  @ApiProperty()
  file?: Express.Multer.File;
}
