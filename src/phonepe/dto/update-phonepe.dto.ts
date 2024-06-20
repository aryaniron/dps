import { PartialType } from '@nestjs/mapped-types';
import { CreatePhonepeDto } from './create-phonepe.dto';

export class UpdatePhonepeDto extends PartialType(CreatePhonepeDto) {}
