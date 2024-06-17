import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsUUID } from 'class-validator';

export class CreatePackageDto {
  @IsString()
  @ApiProperty()
  name: string;

  @IsUUID()
  @ApiProperty()
  unitId: string;
}
