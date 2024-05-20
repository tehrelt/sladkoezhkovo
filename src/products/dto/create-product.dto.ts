import { ApiProperty } from '@nestjs/swagger';
import { Decimal } from '@prisma/client/runtime/library';

export class CreateProductDto {
  @ApiProperty()
  name: string;
  @ApiProperty()
  confectionaryTypeId: string;
  @ApiProperty()
  factoryId: string;
  @ApiProperty()
  weight: Decimal;
}
