import { PartialType } from '@nestjs/swagger';
import { CreateConfectionaryTypeDto } from './create-confectionarytype.dto';

export class UpdateConfectionarytypeDto extends PartialType(
  CreateConfectionaryTypeDto,
) {}
