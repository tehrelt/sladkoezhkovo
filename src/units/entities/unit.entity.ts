import { ApiProperty } from '@nestjs/swagger';

export class Unit {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}
