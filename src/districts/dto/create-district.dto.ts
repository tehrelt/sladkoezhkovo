import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreateDistrictDto {
  @IsString()
  @ApiProperty({ type: String })
  name: string;

  @IsUUID()
  @ApiProperty({ type: String })
  cityId: string;
}
