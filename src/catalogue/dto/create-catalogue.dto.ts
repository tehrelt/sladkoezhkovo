import { ApiProperty } from '@nestjs/swagger';

export class CreateCatalogueDto {
  @ApiProperty()
  productId: string;
  @ApiProperty()
  packageId: string;
  @ApiProperty()
  unitId: string;
  @ApiProperty()
  price: number;
  @ApiProperty()
  quantity: number;
  @ApiProperty()
  unitUsage: number;
}
