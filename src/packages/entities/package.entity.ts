import { ApiProperty } from '@nestjs/swagger';

export class Package {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}
