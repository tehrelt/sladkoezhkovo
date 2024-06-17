import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString } from 'class-validator';
import { ROLE } from 'src/enum/role.enum';

export class SignUpDto {
  @IsString()
  @ApiProperty()
  handle: string;

  @IsEmail()
  @ApiProperty()
  email: string;

  @IsString()
  @ApiProperty()
  lastName: string;

  @IsString()
  @ApiProperty()
  firstName: string;

  @IsString()
  @ApiProperty()
  middleName: string;

  @IsString()
  @ApiProperty()
  password: string;

  @IsString()
  @ApiProperty()
  role: ROLE;
}
