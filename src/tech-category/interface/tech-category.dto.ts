import { PickType } from '@nestjs/mapped-types';
import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { IdsDto } from 'src/shared/default/default.dto';

export class CreateTechCategoryBodyDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsNumber()
  sequence?: number;

  @IsNumber()
  fileId: number;
}

export class UpdateTechCategoryBodyDto extends CreateTechCategoryBodyDto {}

export class DeleteTechCategoryBodyDto extends IdsDto {}
