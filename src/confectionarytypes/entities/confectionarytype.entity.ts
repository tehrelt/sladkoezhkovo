import { ApiProperty } from '@nestjs/swagger';

export class ConfectionaryType {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}
