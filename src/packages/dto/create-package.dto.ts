import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @ApiProperty()
  name: string;
}
