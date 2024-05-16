import { ApiProperty } from '@nestjs/swagger';

export class District {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  cityId: string;
  @ApiProperty()
  city: string;
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
