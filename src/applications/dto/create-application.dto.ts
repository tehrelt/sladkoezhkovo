import { ApiProperty } from '@nestjs/swagger';
import { ROLE } from 'src/enum/role.enum';

export class CreateApplicationDto {
  @ApiProperty()
  role: ROLE;
  @ApiProperty()
  lastName: string;
  @ApiProperty()
  firstName: string;
  @ApiProperty()
  middleName: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  handle: string;
}
