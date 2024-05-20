import { PartialType } from '@nestjs/swagger';
import { CreateCartEntryDto } from './create-cart.dto';

export class UpdateCartDto extends PartialType(CreateCartEntryDto) {}
