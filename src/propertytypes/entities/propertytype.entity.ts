import { ApiProperty } from '@nestjs/swagger';

export class PropertyType {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;
}
