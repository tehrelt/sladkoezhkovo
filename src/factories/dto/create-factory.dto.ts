import { ApiProperty } from '@nestjs/swagger';

export class CreateFactoryDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  handle: string;
  @ApiProperty()
  cityId: string;
  @ApiProperty()
  phoneNumber: string;
  @ApiProperty()
  propertyTypeId: string;
  @ApiProperty()
  ownerId: string;
  @ApiProperty()
  year: number;
  @ApiProperty()
  file?: Express.Multer.File;
}
