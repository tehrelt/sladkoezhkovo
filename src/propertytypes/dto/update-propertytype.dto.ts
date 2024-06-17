import { PartialType } from '@nestjs/swagger';
import { CreatePropertyTypeDto } from './create-propertytype.dto';

export class UpdatePropertyTypeDto extends PartialType(CreatePropertyTypeDto) {}
