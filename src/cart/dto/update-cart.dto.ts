import { PartialType } from '@nestjs/swagger';
import { CreateCartEntryDto } from './create-cart.dto';

export class UpdateCartEntryDto extends PartialType(CreateCartEntryDto) {}
