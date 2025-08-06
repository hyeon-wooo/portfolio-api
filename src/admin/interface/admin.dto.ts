import { PartialType } from '@nestjs/mapped-types';

export class CreateAdminDto {
  name: string;
  level: number;
  email: string;
  password: string;
}

export class UpdateAdminDto extends PartialType(CreateAdminDto) {}
