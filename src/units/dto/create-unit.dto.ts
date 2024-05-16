import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUnitDto {
  @IsString()
  @ApiProperty()
  name: string;
}
