import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  confectionaryTypeId: string;
  @ApiProperty()
  factoryId: string;
}
