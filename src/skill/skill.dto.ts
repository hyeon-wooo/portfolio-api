import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IdsDto } from 'src/shared/default/default.dto';
import { SkillEntity } from './skill.entity';

export class SkillContentDto {
  @IsNotEmpty()
  @IsString()
  content: string;

  @IsOptional()
  @IsNumber()
  sequence?: number;

  @IsNotEmpty()
  @IsNumber()
  skillId: number;
}

export class CreateSkillBodyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  sequence?: number;

  @IsNumber()
  fileId: number;

  @IsArray()
  contents: string[];
}

export class UpdateSkillBodyDto extends CreateSkillBodyDto {}

export class DeleteSkillBodyDto extends IdsDto {}

export class SkillListItemDto {
  constructor(entity: SkillEntity) {
    this.name = entity.name;
    this.imageUrl = entity.file?.url || '';
  }

  name: string;

  imageUrl: string;
}
