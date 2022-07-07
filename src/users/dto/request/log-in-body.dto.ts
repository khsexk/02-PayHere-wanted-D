import { PartialType } from '@nestjs/mapped-types';
import { SingUpBodyDto } from './sign-up-body.dto';

export class LogInBodyDto extends PartialType(SingUpBodyDto) {}
