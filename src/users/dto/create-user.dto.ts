import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from 'src/enum/role.enum';

export class CreateUserDto {
  @ApiProperty()
  handle: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  middleName: string;
  @ApiProperty()
  role: ROLE;
}
