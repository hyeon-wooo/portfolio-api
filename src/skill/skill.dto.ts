import { PickType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { IdsDto } from 'src/shared/default/default.dto';
import { SkillEntity } from './skill.entity';
import { ESkillLevel } from './skill.enum';

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

  @IsOptional()
  @IsEnum(ESkillLevel)
  level?: ESkillLevel;

  @IsArray()
  contents: string[];
}

export class UpdateSkillBodyDto extends CreateSkillBodyDto {}

export class DeleteSkillBodyDto extends IdsDto {}

export class SkillListItemDto {
  constructor(entity: SkillEntity) {
    this.id = entity.id;
    this.name = entity.name;
    this.imageUrl = entity.file?.url || '';
  }

  id: number;

  name: string;

  imageUrl: string;
}

export class SkillListItemWithIdDto extends SkillListItemDto {
  constructor(entity: SkillEntity) {
    super(entity);
    this.id = entity.id;
    this.isActiveFilter = entity.isActiveFilter;
    this.level = entity.level;
  }

  readonly id: number;
  isActiveFilter: boolean;
  level: ESkillLevel;
}

export class SkillDetailDto extends SkillListItemWithIdDto {
  constructor(entity: SkillEntity) {
    super(entity);
    this.fileId = entity.fileId;
    this.contents = entity.contents
      .sort((a, b) => b.sequence - a.sequence)
      .map((content) => content.content);
  }

  contents: string[];
  fileId: number;
}
