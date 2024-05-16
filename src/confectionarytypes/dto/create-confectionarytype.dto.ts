import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateConfectionaryTypeDto {
  @IsString()
  @ApiProperty()
  name: string;
}
